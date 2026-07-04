import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { providerEnum } from "../../enum/user.enum";
import { hashPassword } from "../../security/hash";

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
  })
  name: string;
  @Prop({
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: Date,
    default: undefined,
  })
  confirmedEmail?: Date;

  @Prop({
    type: String,
    enum: providerEnum,
    default: providerEnum.SYSTEM,
  })
  provider: providerEnum;

  @Prop({
    type: String,
    required: function (this:any) {
      return this.provider !== providerEnum.GOOGLE;
    },
  })
  password: string;


  @Prop({
    type: String,
    default: undefined,
  })
  confirmEmailOtp?: string;

  @Prop({
    type: Date,
    default: undefined,
  })
  otpExpiredAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual("id").get(function () {
  return this._id.toString();
});

export type UserDocument = HydratedDocument<User>;

export const UserModelName = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
]);

UserSchema.pre("save", async function (this: UserDocument) {
  if (this.isModified("password")) {
    const saltRounds = parseInt(process.env.SALT || "10", 10);

    const hashedPassword = await hashPassword(
      this.password,
      saltRounds,
    );

    this.password = hashedPassword;
  }
});
