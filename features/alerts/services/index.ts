import { alertsService } from "./alerts.service";
import { mockAlertsService } from "./alerts.mock";

// Use mock service if NEXT_PUBLIC_USE_MOCK_ALERTS is set to true
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_ALERTS === "true";

export const alertsServiceInstance = USE_MOCK ? mockAlertsService : alertsService;

// Export both for flexibility
export { alertsService, mockAlertsService };
