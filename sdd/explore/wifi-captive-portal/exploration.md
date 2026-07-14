## Exploration: WiFi Captive Portal for Alojamientos

### Current State

The GoAventura project has **3 hardcoded accommodations** in `src/lib/data/accommodations.ts` with a static `Accommodation[]` array. There is NO existing WiFi credential storage, QR code generation, or captive portal functionality anywhere in the codebase.

The closest existing flow is the **Contact Advisor** system:

- **Component**: `src/components/contact-advisor-button.tsx` — a `'use client'` Dialog with form fields (nombre, apellido, telefono, consulta) + Zod validation
- **API**: `src/app/api/contact-advisor/route.ts` — validates with Zod, submits to n8n webhook, rate-limited (5 req/15min per IP)
- **Webhook**: `ADVISOR_WEBHOOK_URL = "https://n8n.gali.com.ar/webhook/c808817d-8a08-407a-8bb8-83bc1f86f6ec"` via `WebhookLeadService`
- **Payload**: `{ nombre, apellido, telefono, consulta, productId, productName, productType, pageUrl, timestamp }`

Data persistence pattern for mutable data is: `'use server'` → `fs.readFile/writeFile` on JSON files under `public/data/` (see `statistics.ts`, `featured-accommodation.ts`).

### Affected Areas

| Path | Why affected |
|------|-------------|
| `src/lib/data/accommodations.ts` | Needs `wifi` field added to `Accommodation` interface + data |
| `src/lib/types.ts` | May need `WifiCredentials` type or interface |
| `src/app/alojamientos/[slug]/page.tsx` | Where the "Get WiFi" CTA / button should appear |
| `src/lib/constants.ts` | New webhook URL for captive portal submissions (or reuse existing) |
| `src/app/api/wifi-registration/` | **New** API route for form submission (pattern: same as contact-advisor) |
| `src/components/wifi-captive-portal.tsx` | **New** component — form + success + credentials display |
| `public/data/wifi-credentials.json` | **New** — WiFi credential storage per accommodation |
| `package.json` | **New dep**: `qrcode` or `qrcode.react` for QR generation |

### Approaches

**1. Per-accommodation WiFi page at `/alojamientos/:slug/wifi`**

- Dedicated route page (RSC) that loads accommodation → renders client form → posts to API → shows credentials
- Pros: Clean URL, SEO-friendly if needed, natural for guests scanning QR codes at the property
- Cons: More files to create, guests need to navigate to specific slug
- Effort: Medium (new route, new component, new API)

**2. Dialog/Modal on existing accommodation page**

- Add a "Obtener WiFi" button on `/alojamientos/[slug]/page.tsx` that opens a Dialog (reusing the contact-advisor pattern)
- Pros: Minimal route changes, reuses existing patterns, guest is already on the right page
- Cons: Dialog state handling, less distinctive URL for physical QR codes
- Effort: Low-Medium

**3. Standalone captive portal at `/wifi` with accommodation selector**

- Single page where guest picks accommodation from a dropdown, fills form, gets credentials
- Pros: Simplest for guests who scan a generic QR at any property, single URL to print
- Cons: Extra step (selecting accommodation), doesn't integrate with per-accommodation pages
- Effort: Low

### Data Model Extensions

The `Accommodation` interface needs a `wifi` field:

```typescript
interface WifiCredentials {
  ssid: string;
  password: string;
  qrCode?: string;       // base64 or path to generated QR image
}

// Extended Accommodation interface:
export interface Accommodation {
  // ... existing fields ...
  wifi: WifiCredentials;
}
```

Alternatively, store WiFi credentials in a separate JSON file (`public/data/wifi-credentials.json`) keyed by accommodation slug, to avoid mixing sensitive data with public content:

```json
{
  "loft-centro": {
    "ssid": "Loft Centro WiFi",
    "password": "wifi-password-123",
    "qrCode": "/images/wifi/loft-centro-qr.png"
  }
}
```

**Recommendation**: Store in the accommodation data directly (single source of truth), since these are not highly sensitive credentials (they're posted on the wall of each room). The QR code can be generated client-side rather than stored.

### Integration Points with Existing Webhook

Two options:

**A. Reuse existing `/api/contact-advisor` endpoint** — Add a `wifiRequest: true` field to the payload. The n8n webhook already receives `productType: "accommodation"`. Downside: mixes lead types.

**B. New dedicated API route** — `/api/wifi-registration/route.ts` similar to contact-advisor but with: accommodation slug, guest name, phone number. Sends to same or different webhook. This is cleaner.

**Recommendation**: New API route with new Zod schema and a "wifi_access_request" webhook or the same webhook with a `source: "wifi_captive"` field.

### UI Component Recommendations

| Component | Use case |
|-----------|----------|
| `Dialog` (Radix) | Overlay form + success state — exact same pattern as `contact-advisor-button.tsx` |
| `Select` (Radix) | Accommodation picker on a standalone /wifi page |
| `Input` | Name and phone fields |
| `Button` | Submit + loading/success states |
| `Card` | Display WiFi credentials after success |
| `React Hook Form` (already in project) | Form state management, already used in admin |

The `qrcode` library (npm) is **not installed**. Need to add either:
- `qrcode` (renders to canvas/dataURL — can generate server-side too)
- `qrcode.react` (React component, client-side only)

**Recommendation**: `qrcode.react` for simplest client-side rendering. The `qrcode` package if QR generation is needed server-side (e.g., for pre-generated images in admin).

### Recommendation

**Approach 2** (Dialog on the existing accommodation page) + **separate `/wifi` page** (Approach 3) as secondary:

1. Add `wifi` field to `Accommodation` interface + populate for existing 3 accommodations
2. Create `/api/wifi-registration/route.ts` with Zod schema + rate limiting + webhook call
3. Reuse the `contact-advisor-button.tsx` pattern: create `wifi-captive-dialog.tsx` component
4. Add "Obtener WiFi" button to the sidebar of `/alojamientos/[slug]/page.tsx`
5. Dialog shows: form → loading → success → WiFi credentials (SSID + password + QR)
6. Install `qrcode.react` for client-side QR generation of `WIFI:S:<SSID>;T:WPA;P:<password>;;` format
7. Optionally: create `/wifi` standalone page for generic use across properties

### Risks

- **Rate limiting**: The in-memory `Map` for rate limiting is lost on server restart. For a captive portal that real guests will use, consider a more persistent store. Same 5 req/15min limit may be too restrictive for a property with many guests.
- **Sensitive data in client bundle**: WiFi passwords embedded in the accommodation data will be in the client JS bundle if we import the array directly. Mitigation: server component fetches, or API returns credential data only after form submission.
- **No authentication/verification**: Anyone who visits the page gets the WiFi password. For a physical captive portal this is acceptable (the guest is already on premises), but if the page is indexed by search engines, anyone can get the password remotely. Mitigation: require form submission + basic guard, or add `noindex` meta.
- **QR code library**: Not in project yet — add dependency.
- **Webhook failure**: If the n8n webhook is down, the guest can't get WiFi credentials. Mitigation: show credentials on form submit regardless of webhook success (optimistic UI) or fallback to "show directly" mode.

### Ready for Proposal

Yes. The foundation is well-understood. Key decisions needed:
1. Whether to store WiFi credentials inline in `Accommodation` or separate file
2. Which webhook strategy (new endpoint vs. extended existing)
3. Which QR library (`qrcode.react` vs `qrcode`)
4. Route strategy: dialog-only or dialog + standalone page
5. Whether the form submission is a hard requirement or can be skipped on webhook failure
