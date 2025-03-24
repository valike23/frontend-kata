export interface IFileUpload {
    message: string;
    path: string;
    filename: string
}

export interface Icompetition {
    competitionName: string;
    image: string;
    updatedAt?: Date;
    createdAt?: Date;
    deletedAt?: Date
}

export interface Ientry {
    id?: number;
    name?: string;
    categoryName?: string;
    clubName?: string;
    flag?: string;
    categoryId?: string;
    clubId?: number;
    competitionId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Icategory {
    id?: number;
    categoryName?: string;
    gender?: string;
    competitionId?: number;
    isDrafted?: boolean;
    round?: number;
    edit?: boolean;
    entries?: Ientry[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Iclub {
    id?: number;
    edit?: boolean;
    clubName?: string;
    flag?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Ientry {
    id?: number;
    name?: string;
    edit?: boolean;
    club?: Iclub;
    category?: Icategory;
    competition?: Icompetition;
    categoryName?: string;
    clubName?: string;
    flag?: string;
    categoryId?: string;
    clubId?: number;
    competitionId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Ikata {
    id?: number;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
}