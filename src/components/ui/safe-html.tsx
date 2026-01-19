"use client";

import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
  tagName?: keyof JSX.IntrinsicElements;
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
}

/**
 * SafeHTML component for rendering sanitized HTML content.
 * Prevents XSS attacks by cleaning HTML with DOMPurify.
 * 
 * @param html - Raw HTML string to sanitize and render
 * @param className - Optional CSS classes for the wrapper element
 * @param tagName - HTML tag to use as wrapper (default: 'div')
 * @param allowedTags - Additional tags to allow beyond safe defaults
 * @param allowedAttributes - Additional attributes to allow
 */
export const SafeHTML: React.FC<SafeHTMLProps> = ({
  html,
  className,
  tagName: Tag = 'div',
  allowedTags = [],
  allowedAttributes = {},
}) => {
  // Memoize sanitized HTML to prevent re-sanitizing on every render
  const sanitizedHTML = useMemo(() => {
    if (!html || typeof html !== 'string') {
      return '';
    }

    try {
      // Configure DOMPurify with strict security settings
      const config = {
        // Allow only safe tags by default
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'i', 'b',
          'ul', 'ol', 'li',
          'a',
          'span',
          'div',
          'blockquote',
          'code', 'pre',
          'hr',
          'sub', 'sup',
          ...allowedTags, // Add any custom allowed tags
        ],
        // Allow only safe attributes by default
        ALLOWED_ATTR: [
          'href', 'title', 'alt', 'class', 'id', 'style',
          'target', 'rel',
          ...Object.keys(allowedAttributes).flatMap(attr => allowedAttributes[attr]),
        ],
        // Prevent any kind of protocol except safe ones
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xx|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        // Remove any data URIs that aren't images
        FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'button'],
        FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'],
        // Keep children for valid tags
        KEEP_CONTENT: true,
        // Return DOM tree instead of string
        RETURN_DOM: false,
        // Return DOM fragment instead of full document
        RETURN_DOM_FRAGMENT: false,
        // Return DOM import node
        RETURN_DOM_IMPORT: false,
        // Sanitize for Shadow DOM
        WHOLE_DOCUMENT: false,
        // Use custom hooks if needed
        CUSTOM_ELEMENT_HANDLING: {
          tagNameCheck: null,
          attributeNameCheck: null,
          allowCustomizedBuiltInElements: false,
        },
      };

      // Additional security for links
      if (config.ALLOWED_ATTR.includes('href')) {
        // Force rel="noopener noreferrer" for external links
        (config as any).ADD_ATTR = ['rel'];
        (config as any).FORCE_BODY = true;
      }

      return DOMPurify.sanitize(html, config);
    } catch (error) {
      console.error('SafeHTML: Error sanitizing HTML:', error);
      // Return empty string on error to prevent any content rendering
      return '';
    }
  }, [html, allowedTags, allowedAttributes]);

  // If no sanitized content, render empty element
  if (!sanitizedHTML) {
    return <Tag className={className} />;
  }

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      suppressHydrationWarning
    />
  );
};

/**
 * Higher-order component for wrapping existing components with SafeHTML
 */
export const withSafeHTML = <P extends object>(
  Component: React.ComponentType<P>,
  htmlProp: keyof P = 'html' as keyof P
) => {
  const WrappedComponent = (props: P) => {
    const htmlContent = props[htmlProp] as string;
    
    if (typeof htmlContent === 'string') {
      return (
        <Component
          {...props}
          {...({ [htmlProp]: <SafeHTML html={htmlContent} /> } as P)}
        />
      );
    }
    
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withSafeHTML(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Hook for sanitizing HTML strings
 */
export const useSafeHTML = (html: string, options?: {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
}) => {
  return useMemo(() => {
    if (!html || typeof html !== 'string') {
      return '';
    }

    try {
      const config = {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'i', 'b',
          'ul', 'ol', 'li',
          'a',
          'span',
          'div',
          'blockquote',
          'code', 'pre',
          'hr',
          ...(options?.allowedTags || []),
        ],
        ALLOWED_ATTR: [
          'href', 'title', 'alt', 'class', 'id', 'style',
          'target', 'rel',
          ...(Object.keys(options?.allowedAttributes || {}).flatMap(
            attr => options?.allowedAttributes?.[attr] || []
          )),
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xx|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'button'],
        FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'],
        KEEP_CONTENT: true,
      };

      return DOMPurify.sanitize(html, config);
    } catch (error) {
      console.error('useSafeHTML: Error sanitizing HTML:', error);
      return '';
    }
  }, [html, options?.allowedTags, options?.allowedAttributes]);
};

export default SafeHTML;