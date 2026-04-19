export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}


export interface IContentManager {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    gender: Gender;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    user : {
        status : UserStatus
    };

}

export interface ICreateContentManagerPayload {
    password: string;
    contentManager: {
        name: string;
        email: string;
        contactNumber: string;
        gender: Gender;
    };
}

export interface IUpdateContentManagerPayload {
    contentManager?: {
        name?: string;
        contactNumber?: string;
        gender?: Gender;
    };
}

export interface IContentManagerUserDetails {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    status: UserStatus;
    emailVerified?: boolean;
    image?: string;
    isDeleted?: boolean;
    deletedAt?: string | Date | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export interface IContentManagerDetails extends IContentManager {
    user: IContentManagerUserDetails;
}
