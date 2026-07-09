import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    timestamps: true,

})

export class Catogrey {
    
    @Prop({ type: String, required: true, unique: true ,trim:true})
    name!: string
        @Prop({ type: String, required: true, unique: true, trim:true })
    logo!: string 
    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'SubCatogrey'})
    subCatogrey!: mongoose.Types.ObjectId
}

export type HydratedCatogrey = HydratedDocument<Catogrey>;
export const CatogreySchema = SchemaFactory.createForClass(Catogrey);
