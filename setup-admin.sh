#!/bin/bash

# =============================================================================
# GoAventura Admin Setup Script
# =============================================================================

set -e

echo "🚀 GoAventura - Setup Administrativo"
echo "========================================"

# Check if server is running
if ! curl -s http://localhost:9002 >/dev/null 2>&1; then
    echo "❌ Error: El servidor no está corriendo en http://localhost:9002"
    echo "Por favor, inicia el servidor con 'npm run dev' antes de continuar"
    exit 1
fi

echo "✅ Servidor corriendo correctamente"

# Function to create admin user
create_admin_user() {
    echo "�️ Creando usuario administrador..."
    
    curl -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $1" \
        -d '{
            "email": "admin@goaventura.com.ar",
            "uid": "firebase_auth_uid_placeholder",
            "role": "admin"
        }' \
        "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.TokenService" \
        -d "grant_type": "urn:ietf:params:oauth:grant-type:jwt: bearer:target_audience" \
        -d "scope": "https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email" \
        -d "target_principal=admin@goaventura.com.ar" \
        -d "include_granted_scopes=true" \
        "d "return_id_token=true"' \
        'https://oauth2.googleapis.com/token'
        "$1" 2>/dev/null
    
    if [ ${PIPESTATUS[0]} -ne 0 ]; then
        echo "✅ Token de OAuth creado exitosamente"
        
        # Extract ID token from response
        ID_TOKEN=$(curl -s "https://oauth2.googleapis.com/token" -d "$1" | grep -o '"id_token":"' | sed 's/.*"id_token":"\([^"]*)".*/\1/' 2>/dev/null)
        
        if [ -n "$ID_TOKEN" ]; then
            echo "✅ ID Token obtenido: ${ID_TOKEN:0:10}..."
            
            # Verify ID token and get user email
            USER_INFO=$(curl -s -H "Authorization: Bearer $1" \
                -H "x-goog-auth-login: oauth2.googleapis.com/token" \
                "https://www.googleapis.com/oauth/v1/userinfo" \
                "$ID_TOKEN" 2>/dev/null)
            
            USER_EMAIL=$(echo "$USER_INFO" | grep -o '"email":"' | sed 's/.*"email":"\([^"]*)".*/\1/' 2>/dev/null)
            
            if [ -n "$USER_EMAIL" ]; then
                echo "✅ Email del usuario: $USER_EMAIL"
                
                # Create admin user in Firestore
                echo "📝 Creando usuario en Firestore..."
                
                ADMIN_UID=$(curl -s -H "Authorization: Bearer $1" \
                    -H "Content-Type: application/json" \
                    -d '{
                        "uid": "'$USER_EMAIL'",
                        "email": "'$USER_EMAIL'",
                        "displayName": "Admin GoAventura",
                        "photoURL": "https://ui-avatars.com/avatar/'$USER_EMAIL'.jpg",
                        "role": "admin",
                        "permissions": ["read_content", "write_content", "delete_content", "manage_users", "view_analytics", "view_site_settings"],
                        "isActive": true,
                        "createdAt": "'$(date -u +%Y%m%d_%H%M%S)'"
                    }' \
                    "https://identitytoolkit.googleapis.com/google.identitytoolkit.v1.TokenService" \
                    "$ID_TOKEN" 2>/dev/null
                
                ADMIN_CREATE_RESPONSE=$(curl -s -w "%HTTP%{http_code}" -o "%HTTP_SIZE}" \
                    -H "Content-Type: application/json" \
                    -d '{"email":"'$USER_EMAIL'", "displayName":"Admin GoAventura"}' \
                    "https://identitytoolkit.googleapis.com/google.identitytoolkit.v1.TokenService" \
                    "$ID_TOKEN" 2>/dev/null
                
                if [ "${HTTP_CODE}" -eq "200" ]; then
                    echo "✅ Usuario admin creado exitosamente"
                    echo "📧 Email: $USER_EMAIL"
                    
                    # Save user ID to file for reference
                    echo "$USER_EMAIL" > .admin-user-id.txt
                    echo "UID del usuario: $(cat .admin-user-id.txt)"
                    
                    # Test admin access
                    echo "🧪 Probando acceso de administrador..."
                    TEST_ACCESS=$(curl -s -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
                        "http://localhost:9002/api/admin/protected" 2>/dev/null)
                    
                    if [ "${HTTP_CODE}" -eq "200" ]; then
                        echo "✅ Acceso de administrador confirmado"
                        echo "🎯 ¡Usuario admin creado exitosamente!"
                        return 0
                    else
                        echo "❌ Error al probar acceso de administrador"
                        return 1
                    fi
                else
                    echo "❌ Error al crear usuario admin: ${HTTP_CODE}"
                    return 1
                fi
            else
                echo "❌ Error al obtener ID Token: ${HTTP_CODE}"
                return 1
            fi
        else
            echo "❌ Error al crear Token de OAuth: ${HTTP_CODE}"
            return 1
        fi
        
        return 0
    fi
}

# Function to verify admin access
verify_admin_access() {
    echo "🔍 Verificando acceso a sección admin..."
    
    ADMIN_ACCESS=$(curl -s -H "Authorization: Bearer $1" \
        "http://localhost:9002/api/admin/protected" 2>/dev/null)
    
    HTTP_CODE=${PIPESTATUS[0]}
    
    if [ "${HTTP_CODE}" -eq "200" ]; then
        echo "✅ Acceso a admin confirmado exitosamente!"
        echo "🎯 ¡Administración lista para usar!"
        
        # Test admin dashboard access
        echo "🧪 Probando dashboard..."
        DASHBOARD_TEST=$(curl -s http://localhost:9002/admin 2>/dev/null | grep -o "title" | head -1)
        
        if [ -n "$DASHBOARD_TEST" ]; then
            echo "✅ Dashboard accesible"
            echo "🎯 ¡Panel administrativo funcional!"
            return 0
        else
        echo "❌ Dashboard no accesible"
            return 1
    else
        echo "❌ Error al verificar acceso: ${HTTP_CODE}"
        return 1
    fi
}

# Main execution function
main() {
    echo "🎯 GoAventura - Setup Administrativo"
    echo "========================================"
    
    # Check prerequisites
    command -v curl >/dev/null 2>/dev/null || {
        echo "❌ Error: curl no está disponible"
        echo "Por favor, instala curl para continuar."
        exit 1
    }
    
    # Start execution
    echo "🔑 Paso 1: Verificar que el servidor esté corriendo"
    if ! curl -s http://localhost:9002 >/dev/null 2>&1; then
        echo "❌ El servidor no está corriendo"
        echo "Por favor, inicia el servidor con:"
        echo "  npm run dev"
        exit 1
    fi
    
    echo "✅ Servidor verificado"
    
    echo "🔑 Paso 2: Crear usuario administrador"
    if create_admin_user; then
        echo "✅ Usuario administrador creado exitosamente"
        
        echo ""
        echo "🔑 Paso 3: Verificar acceso a administración"
        if verify_admin_access; then
            echo ""
            echo ""
            echo "🎉 ¡CONFIGURACIÓN COMPLETADA!"
            echo ""
            echo "🎯 Puedes acceder a http://localhost:9002/admin"
            echo ""
            echo "👤 Email del administrador: $(cat .admin-user-id.txt 2>/dev/null || echo "Verificar archivo .admin-user-id.txt"
            echo ""
            echo "🎂 Usuario creado con:"
            echo "   - Email: admin@goaventura.com.ar"
            echo "   - Rol: admin"
            echo "   - Permisos: Todos los permisos"
            echo ""
            echo "🔑 Para probar el acceso:"
            echo "   1. Intenta acceder a http://localhost:9002/login"
            echo "   2. Una vez autenticado, verica que puedas acceder a /admin"
            echo "   3. Ve al dashboard en http://localhost:9002/admin"
            echo ""
            echo "📚 Inicia sesión y prueba el acceso completo"
        else
        echo ""
            echo "❌ Error en la creación del usuario administrador"
        fi
    fi
}

# Run main function
main "$@"