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