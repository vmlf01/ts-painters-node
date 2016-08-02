declare module "mongoose-paginate" {
    import * as mongoose from "mongoose";

    interface IOptions {
        select?: Object | string;
        sort?: Object | string;
        populate?: Array<string> | Object | string;
        lean?: boolean;
        leanWithId?: boolean;
        offset?: number;
        page?: number;
        limit?: number;
    }

    interface IMongoosePaginate {
        (schema: mongoose.Schema): any;
        paginate(query?: Object, options?: IOptions, callback?: (err: Object, result: any) => any): any;
    }

    const mongoosePaginate: IMongoosePaginate;
    export = mongoosePaginate;
}