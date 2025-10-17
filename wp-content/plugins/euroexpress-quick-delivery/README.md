# Euroexpress Quick Delivery

## Overview

Euroexpress Quick Delivery integrates Euroexpress shipping services with WordPress. The plugin provides admin utilities for caching city/location metadata, creating shipments, tracking deliveries, and exposes a public tracking shortcode for visitors.

## Installation

1. Copy the `euroexpress-quick-delivery` folder into your WordPress installation under `wp-content/plugins/`.
2. Activate **Euroexpress Quick Delivery** from the WordPress Plugins screen.
3. Navigate to **Settings → Euroexpress Settings** to configure API credentials and choose the desired environment (test or production).

## Configuration

The settings page stores the following options:

- **Username** and **Password**: Euroexpress Basic Auth credentials.
- **Environment**: Toggle between the Euroexpress test and production API endpoints.

All settings are persisted using the WordPress options API.

## Admin Tools

After activation, a new **Euroexpress** menu appears inside the WordPress dashboard:

- **Cached Data**: Refresh and inspect locally cached cities and locations retrieved from the Euroexpress API.
- **Create Shipment**: Submit sender/recipient/package details, trigger a preannounce and announce request, and optionally fetch a printable label. Results are surfaced as admin notices. Printable labels (raw Base64) are cached for 30 minutes.
- **Track Shipments**: Query shipment status using a tracking code or reference number. Responses are displayed in a formatted JSON block. Previous results are cleared after viewing.

All admin forms are protected with capability checks (`manage_options`) and WordPress nonces. Requests are handled using `admin-post.php` endpoints.

## Public Shortcode

Use the `[euroexpress_tracking]` shortcode within posts, pages, or widgets to embed a public tracking form. The shortcode:

1. Renders a form capturing a tracking code and/or reference number.
2. Validates user input and enforces WordPress nonce verification.
3. Performs a shipment status request and displays any returned data or error messages.

Form submissions are redirected back to the referrer (or the homepage as a fallback) and the most recent response is surfaced on the next page load. Results are stored temporarily with transients for five minutes.

## API Service

All HTTP requests are executed through the `Euroexpress_QD_API_Service` class which wraps `wp_remote_request`. The service automatically:

- Targets the correct Euroexpress API base URL for the configured environment.
- Applies the configured Basic Auth credentials and JSON headers.
- Handles JSON encoding of request payloads.
- Reports network failures and HTTP 4xx/5xx responses with descriptive messages.

## Security

- Admin pages require the `manage_options` capability.
- Admin forms and the public shortcode both include WordPress nonce validation.
- User input is sanitized before interacting with the API service.

## Shortcode Example

```
[euroexpress_tracking]
```

Add the shortcode to any page to provide a self-service tracking widget for your visitors.

## Development

- Cached cities and locations are stored as WordPress options (`euroexpress_qd_cached_cities` and `euroexpress_qd_cached_locations`).
- Tracking results and printable labels are cached briefly via transients for convenience.
- The plugin creates its settings options on activation and removes cached data on deactivation.

## Support

This plugin scaffold is provided as-is. Extend the admin forms and API payloads to match the latest Euroexpress API contract before using in production.
