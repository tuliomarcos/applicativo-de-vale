import { DashboardService } from './dashboard.service';
import { DashboardStatsResponse } from '../types/api';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<DashboardStatsResponse>;
}
