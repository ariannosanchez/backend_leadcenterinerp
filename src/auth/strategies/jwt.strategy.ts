// import { Inject, Injectable } from "@nestjs/common";
// import { ConfigType } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { PayloadToken } from "../interfaces/token.entity";
// import config from "src/config";

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {

//     constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration: false,
//             secretOrKey: configService,
//         });
//     }

//     async validate(payload: PayloadToken) {
//         return payload;
//     }

// }