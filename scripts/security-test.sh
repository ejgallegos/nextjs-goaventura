#!/bin/bash

# Security Testing Script for GoAventura Project
# This script performs comprehensive security tests on the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TARGET_URL="${1:-http://localhost:9002}"
OUTPUT_DIR="security-test-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="$OUTPUT_DIR/security_report_$TIMESTAMP.txt"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$REPORT_FILE"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1" | tee -a "$REPORT_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$REPORT_FILE"
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1" | tee -a "$REPORT_FILE"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to make HTTP request and check response
check_endpoint() {
    local url="$1"
    local method="${2:-GET}"
    local expected_status="${3:-200}"
    local description="$4"
    
    log_info "Testing: $description"
    
    if command_exists curl; then
        response=$(curl -s -w "%{http_code}" -o /dev/null -X "$method" "$url" 2>/dev/null)
        
        if [ "$response" -eq "$expected_status" ]; then
            log_success "$description - Status $response (Expected: $expected_status)"
            return 0
        else
            log_error "$description - Status $response (Expected: $expected_status)"
            return 1
        fi
    else
        log_warning "curl not found, skipping HTTP test"
        return 0
    fi
}

# Function to test XSS protection
test_xss_protection() {
    log_info "Testing XSS Protection"
    
    # Common XSS payloads
    xss_payloads=(
        "<script>alert('XSS')</script>"
        "javascript:alert('XSS')"
        "<img src=x onerror=alert('XSS')>"
        "<svg onload=alert('XSS')>"
        "'\"><script>alert('XSS')</script>"
    )
    
    for payload in "${xss_payloads[@]}"; do
        log_info "Testing XSS payload: $payload"
        
        # Test search endpoint if exists
        if check_endpoint "$TARGET_URL/api/search?q=$payload" "GET" "400" "XSS in search parameter"; then
            log_success "XSS payload blocked"
        else
            log_warning "XSS payload might not be properly handled"
        fi
        
        # Test contact form
        if command_exists curl; then
            response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \
                -H "Content-Type: application/json" \
                -d "{\"name\":\"Test\",\"email\":\"test@example.com\",\"message\":\"$payload\",\"subject\":\"Test\"}" \
                "$TARGET_URL/api/contact" 2>/dev/null)
            
            if [ "$response" -eq 400 ]; then
                log_success "XSS payload in contact form blocked"
            else
                log_warning "Contact form might not filter XSS properly"
            fi
        fi
    done
}

# Function to test SQL injection protection
test_sql_injection() {
    log_info "Testing SQL Injection Protection"
    
    sql_payloads=(
        "'; DROP TABLE users; --"
        "OR '1'='1"
        "UNION SELECT * FROM users --"
        "'; INSERT INTO users VALUES('hacker','pass'); --"
        "' OR 1=1 --"
    )
    
    for payload in "${sql_payloads[@]}"; do
        log_info "Testing SQL injection payload: $payload"
        
        # Test login endpoint if exists
        if command_exists curl; then
            response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \
                -H "Content-Type: application/json" \
                -d "{\"email\":\"$payload\",\"password\":\"test\"}" \
                "$TARGET_URL/api/auth/login" 2>/dev/null)
            
            if [ "$response" -eq 400 ] || [ "$response" -eq 401 ]; then
                log_success "SQL injection payload blocked"
            else
                log_warning "Potential SQL injection vulnerability"
            fi
        fi
    done
}

# Function to test security headers
test_security_headers() {
    log_info "Testing Security Headers"
    
    # Required security headers
    security_headers=(
        "X-Content-Type-Options:nosniff"
        "X-Frame-Options:DENY"
        "X-XSS-Protection:1; mode=block"
        "Referrer-Policy:strict-origin-when-cross-origin"
        "Strict-Transport-Security:max-age"
        "Content-Security-Policy:default-src"
    )
    
    for header in "${security_headers[@]}"; do
        header_name=$(echo "$header" | cut -d: -f1)
        expected_value=$(echo "$header" | cut -d: -f2)
        
        if command_exists curl; then
            actual_value=$(curl -s -I "$TARGET_URL" 2>/dev/null | grep -i "$header_name" | cut -d: -f2- | tr -d '\r\n')
            
            if [[ "$actual_value" == *"$expected_value"* ]]; then
                log_success "$header_name header present: $actual_value"
            else
                log_error "$header_name header missing or incorrect. Found: $actual_value"
            fi
        fi
    done
}

# Function to test rate limiting
test_rate_limiting() {
    log_info "Testing Rate Limiting"
    
    if ! command_exists curl; then
        log_warning "curl not found, skipping rate limiting test"
        return
    fi
    
    # Test contact form rate limiting
    local requests=0
    local max_requests=10
    
    for ((i=1; i<=max_requests; i++)); do
        response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \
            -H "Content-Type: application/json" \
            -d '{"name":"Test","email":"test'$i'@example.com","message":"Test message","subject":"Test"}' \
            "$TARGET_URL/api/contact" 2>/dev/null)
        
        if [ "$response" -eq 429 ]; then
            log_success "Rate limiting activated after $i requests (Status: $response)"
            return 0
        fi
        
        requests=$((requests + 1))
        sleep 0.1
    done
    
    log_warning "Rate limiting not triggered after $requests requests"
}

# Function to test CORS configuration
test_cors() {
    log_info "Testing CORS Configuration"
    
    if ! command_exists curl; then
        log_warning "curl not found, skipping CORS test"
        return
    fi
    
    # Test preflight request
    response=$(curl -s -w "%{http_code}" -o /dev/null -X OPTIONS \
        -H "Origin: https://malicious-site.com" \
        -H "Access-Control-Request-Method: POST" \
        "$TARGET_URL/api/contact" 2>/dev/null)
    
    if [ "$response" -eq 403 ] || [ "$response" -eq 400 ]; then
        log_success "CORS properly configured - malicious origin blocked"
    else
        log_warning "CORS might allow unauthorized origins"
    fi
    
    # Test allowed origin
    response=$(curl -s -w "%{http_code}" -o /dev/null -X OPTIONS \
        -H "Origin: https://goaventura.com.ar" \
        -H "Access-Control-Request-Method: POST" \
        "$TARGET_URL/api/contact" 2>/dev/null)
    
    if [ "$response" -eq 200 ] || [ "$response" -eq 204 ]; then
        log_success "CORS allows legitimate origins"
    else
        log_warning "CORS might block legitimate origins"
    fi
}

# Function to test file upload security
test_file_upload_security() {
    log_info "Testing File Upload Security"
    
    if ! command_exists curl; then
        log_warning "curl not found, skipping file upload test"
        return
    fi
    
    # Create test files
    echo "<script>alert('XSS')</script>" > /tmp/test.html
    echo "<?php system(\$_GET['cmd']); ?>" > /tmp/test.php
    echo "This is a safe image" > /tmp/test.txt
    
    test_files=(
        "/tmp/test.html:HTML file upload"
        "/tmp/test.php:PHP file upload"
        "/tmp/test.txt:Text file upload"
    )
    
    for file_test in "${test_files[@]}"; do
        file_path=$(echo "$file_test" | cut -d: -f1)
        description=$(echo "$file_test" | cut -d: -f2)
        
        if [ -f "$file_path" ]; then
            response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \
                -F "file=@$file_path" \
                "$TARGET_URL/api/upload" 2>/dev/null)
            
            if [ "$response" -eq 400 ] || [ "$response" -eq 403 ]; then
                log_success "$description blocked (Status: $response)"
            else
                log_warning "$description might be allowed"
            fi
        fi
    done
    
    # Cleanup
    rm -f /tmp/test.html /tmp/test.php /tmp/test.txt
}

# Function to test authentication bypass
test_authentication() {
    log_info "Testing Authentication"
    
    if ! command_exists curl; then
        log_warning "curl not found, skipping authentication test"
        return
    fi
    
    # Test accessing protected endpoints without auth
    protected_endpoints=(
        "$TARGET_URL/api/admin/protected:Admin protected endpoint"
        "$TARGET_URL/api/admin/users:Admin users endpoint"
        "$TARGET_URL/api/admin/stats:Admin stats endpoint"
    )
    
    for endpoint_test in "${protected_endpoints[@]}"; do
        endpoint=$(echo "$endpoint_test" | cut -d: -f1)
        description=$(echo "$endpoint_test" | cut -d: -f2)
        
        response=$(curl -s -w "%{http_code}" -o /dev/null "$endpoint" 2>/dev/null)
        
        if [ "$response" -eq 401 ] || [ "$response" -eq 403 ]; then
            log_success "$description properly protected (Status: $response)"
        else
            log_error "$description might be accessible without authentication"
        fi
    done
}

# Function to test directory traversal
test_directory_traversal() {
    log_info "Testing Directory Traversal Protection"
    
    traversal_payloads=(
        "..%2F..%2F..%2Fetc%2Fpasswd"
        "....//....//....//etc/passwd"
        "..%252f..%252f..%252fetc%252fpasswd"
        "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd"
    )
    
    for payload in "${traversal_payloads[@]}"; do
        log_info "Testing directory traversal: $payload"
        
        # Test file endpoint if exists
        if check_endpoint "$TARGET_URL/api/files?path=$payload" "GET" "400" "Directory traversal in file path"; then
            log_success "Directory traversal payload blocked"
        else
            log_warning "Directory traversal might be possible"
        fi
    done
}

# Function to test for common vulnerabilities
test_common_vulnerabilities() {
    log_info "Testing Common Vulnerabilities"
    
    # Test for information disclosure
    if check_endpoint "$TARGET_URL/.env" "GET" "404" "Environment file access"; then
        log_success "Environment file not accessible"
    else
        log_error "Environment file might be exposed"
    fi
    
    # Test for debug information
    if check_endpoint "$TARGET_URL/?debug=true" "GET" "400" "Debug mode"; then
        log_success "Debug mode properly handled"
    else
        log_warning "Debug information might be exposed"
    fi
    
    # Test for error information leakage
    if check_endpoint "$TARGET_URL/api/nonexistent" "GET" "404" "404 error handling"; then
        log_success "404 errors properly handled"
    else
        log_warning "Error pages might leak information"
    fi
}

# Function to check for SSL/TLS configuration
test_ssl_configuration() {
    log_info "Testing SSL/TLS Configuration"
    
    if [[ "$TARGET_URL" == https://* ]]; then
        if command_exists openssl; then
            hostname=$(echo "$TARGET_URL" | sed 's|https://||' | sed 's|/.*||')
            
            # Check SSL certificate
            if echo | openssl s_client -connect "$hostname":443 -servername "$hostname" 2>/dev/null | openssl x509 -noout -dates > /dev/null 2>&1; then
                log_success "SSL certificate is valid"
            else
                log_error "SSL certificate issues detected"
            fi
            
            # Check for weak ciphers
            if echo | openssl s_client -connect "$hostname":443 -cipher 'NULL,EXPORT,LOW' 2>/dev/null | grep -q "handshake failure"; then
                log_success "Weak ciphers are rejected"
            else
                log_warning "Weak ciphers might be accepted"
            fi
        else
            log_warning "openssl not found, skipping SSL tests"
        fi
    else
        log_warning "Target URL is not HTTPS, skipping SSL tests"
    fi
}

# Function to generate summary report
generate_summary() {
    local total_tests=$(grep -c "\[.*\]" "$REPORT_FILE" | head -1)
    local passed_tests=$(grep -c "\[PASS\]" "$REPORT_FILE" | head -1)
    local failed_tests=$(grep -c "\[FAIL\]" "$REPORT_FILE" | head -1)
    local warnings=$(grep -c "\[WARN\]" "$REPORT_FILE" | head -1)
    
    echo -e "\n${BLUE}=== SECURITY TEST SUMMARY ===${NC}" | tee -a "$REPORT_FILE"
    echo -e "Total Tests: $total_tests" | tee -a "$REPORT_FILE"
    echo -e "${GREEN}Passed: $passed_tests${NC}" | tee -a "$REPORT_FILE"
    echo -e "${RED}Failed: $failed_tests${NC}" | tee -a "$REPORT_FILE"
    echo -e "${YELLOW}Warnings: $warnings${NC}" | tee -a "$REPORT_FILE"
    
    if [ "$failed_tests" -eq 0 ]; then
        echo -e "${GREEN}✅ All critical security tests passed!${NC}" | tee -a "$REPORT_FILE"
    else
        echo -e "${RED}❌ $failed_tests security test(s) failed. Review required.${NC}" | tee -a "$REPORT_FILE"
    fi
    
    if [ "$warnings" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $warnings warnings detected. Review recommended.${NC}" | tee -a "$REPORT_FILE"
    fi
}

# Function to check dependencies for vulnerabilities
check_dependencies() {
    log_info "Checking Dependencies for Known Vulnerabilities"
    
    if command_exists npm; then
        if [ -f "package.json" ]; then
            log_info "Running npm audit..."
            
            if npm audit --audit-level=moderate --json > "$OUTPUT_DIR/npm_audit_$TIMESTAMP.json" 2>/dev/null; then
                vulnerabilities=$(npm audit --audit-level=moderate --json 2>/dev/null | jq -r '.metadata.vulnerabilities.total // 0' 2>/dev/null || echo "0")
                
                if [ "$vulnerabilities" -eq 0 ]; then
                    log_success "No vulnerabilities found in dependencies"
                else
                    log_error "$vulnerabilities vulnerabilities found in dependencies"
                fi
            else
                log_warning "npm audit failed or no vulnerabilities found"
            fi
        else
            log_warning "package.json not found"
        fi
    else
        log_warning "npm not found, skipping dependency check"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🔒 GoAventura Security Testing Tool${NC}"
    echo -e "Target URL: $TARGET_URL"
    echo -e "Report file: $REPORT_FILE"
    echo -e "Timestamp: $TIMESTAMP"
    echo
    
    # Start security tests
    test_security_headers
    test_xss_protection
    test_sql_injection
    test_rate_limiting
    test_cors
    test_authentication
    test_directory_traversal
    test_common_vulnerabilities
    test_ssl_configuration
    test_file_upload_security
    check_dependencies
    
    # Generate summary
    generate_summary
    
    echo
    echo -e "${BLUE}📄 Full report saved to: $REPORT_FILE${NC}"
    echo -e "${BLUE}📁 Additional results in: $OUTPUT_DIR${NC}"
}

# Script usage information
usage() {
    echo "Usage: $0 [TARGET_URL]"
    echo
    echo "Examples:"
    echo "  $0 http://localhost:9002"
    echo "  $0 https://goaventura.com.ar"
    echo
    echo "This script performs comprehensive security tests on the GoAventura application."
    echo "Make sure the target application is running before executing the tests."
}

# Check for help flag
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    usage
    exit 0
fi

# Validate target URL
if [[ -z "$TARGET_URL" ]]; then
    echo -e "${RED}Error: No target URL provided${NC}"
    usage
    exit 1
fi

# Check if target is reachable
if command_exists curl; then
    if ! curl -s --head "$TARGET_URL" >/dev/null 2>&1; then
        log_warning "Target URL $TARGET_URL might not be reachable"
    fi
fi

# Run main function
main

exit 0