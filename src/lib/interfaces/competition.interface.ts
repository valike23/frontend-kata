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
    categoryId?: number;
    clubId?: number;
    competitionId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface partialEntry {
    name: string;
    club: string;
}

export interface Ikata {
    id?: number;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Ijudge {
    id?: number;
    judgeName: string;
    password: string;
    editName?: boolean;
    edit?: boolean;
    createdAt?: Date;
    updatedAt?: Date
}

export interface Ibout {
    id?: number;
    entry1Id?: number;
    entry1?: Ientry,
    entry2?: Ientry,
    entry2Id?: number;
    winnerId?: number;
    categoryId?: number;
    round?: number;
    competitionId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}