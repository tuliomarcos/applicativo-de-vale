declare enum TripType {
    ENTULHO = "ENTULHO",
    TERRA = "TERRA"
}
export declare class CreateValeViagemDto {
    clientId: string;
    truckPlate: string;
    driverName: string;
    tripType: TripType;
    workLocation: string;
    date: string;
    signatureData: string;
}
export declare class CreateValeDiariaDto {
    clientId: string;
    operatorName: string;
    workLocation: string;
    date: string;
    morningStart: string;
    morningEnd: string;
    afternoonStart: string;
    afternoonEnd: string;
    totalHours: number;
    equipment: string;
    signatureData: string;
}
export declare class UpdateValeDto {
    workLocation?: string;
    truckPlate?: string;
    driverName?: string;
    tripType?: TripType;
    operatorName?: string;
    morningStart?: string;
    morningEnd?: string;
    afternoonStart?: string;
    afternoonEnd?: string;
    totalHours?: number;
    equipment?: string;
}
export {};
