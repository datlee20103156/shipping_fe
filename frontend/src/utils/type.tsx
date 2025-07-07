export type Customer = {
    _id: string;
    fullname: string;
    phone: string;
    password?: string;
    role?: string;
    createdAt: string;
    updatedAt: string;
    isActive?: boolean;
}
export type Fee = {
    _id: string;
    fromDistrict: string;
    toDistrict: string;
    senderWard?: string;
    receiverWard?: string;
    baseFee: number;
    extraPerKg: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export type Order = {
    _id: string,
    code: string,
    receiver: {
        name: string,
        phone: string,
        address: string,
        district: string
    },
    sender: {
        name: string,
        phone: string,
        address: string,
        district: string
    },
    item: [
        {
            name: string,
            weight: number,
            isFragile: true
        }
    ],
    fee: 0,
    cod: 0,
    status: string,
    shipperId: {
        _id?: string;
        fullname?: string;
        phone?: string;
        password?: string;
        role?: string;
        createdAt?: string;
        updatedAt?: string;
        isActive?: boolean;
    } | null | undefined,
    note: "",
    timeReceipt: string
    senderWard?: string;
    receiverWard?: string;
    createdAt?: string;
    updatedAt?: string;
}
export type OrderDetails = {
    _id: string,
    code: string,
    receiver: {
        name: string,
        phone: string,
        address: string,
        district: string
    },
    sender: {
        name: string,
        phone: string,
        address: string,
        district: string
    },
    items: [
        {
            name: string,
            weight: number,
            isFragile: true
        }
    ],
    fee: 0,
    cod: 0,
    status: string,
    shipperId: {
        _id?: string;
        fullname?: string;
        phone?: string;
        password?: string;
        role?: string;
        createdAt?: string;
        updatedAt?: string;
        isActive?: boolean;
    } | null | undefined,
    note: "",
    timeReceipt: string
    senderWard?: string;
    receiverWard?: string;
    createdAt?: string;
    updatedAt?: string;
}
// Base types
interface BaseDocument {
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// User/Actor types
interface Actor extends BaseDocument {
    fullname: string;
    phone: string;
    role: string[];
    isActive: boolean;
}

export type OrderStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
// Order log type enum
type OrderLogType = "ORDER";

// Main OrderLog interface
export type OrderLog = BaseDocument & {
    oid: OrderDetails;
    type: OrderLogType;
    actorId: Actor;
    note: string;
}

export type Ward = {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    district_code: number;
}

export type District = {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    province_code: number;
    wards: Ward[];
}

export type ProvinceData = {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    phone_code: number;
    districts: District[];
}