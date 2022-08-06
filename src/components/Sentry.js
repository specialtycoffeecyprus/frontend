import * as Sentry from "@sentry/browser";
import {BrowserTracing} from "@sentry/tracing";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
});
