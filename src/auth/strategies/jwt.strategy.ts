import { Inject, Injectable } from "@nestjs/common";
import { ConfigService, ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadToken } from "../interfaces/token.entity";
import config from "src/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {

    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_ACCESS_SECRET')!,
        });
    }

    async validate(payload: PayloadToken) {
        return payload;
    }

}