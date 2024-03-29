import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { AppGateway } from './app.gateway';
import { ChatGateway } from './chat/chat.gateway';
import * as config from './data-source';
import { SocketsService } from './sockets.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User, Status } from './entities/User';
import { GameGateway } from './game/game.gateway';
import { JwtService } from '@nestjs/jwt';
import { UserGateway } from './user/user.gateway';
import { HistoryGateway } from './history/history.gateway';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([User]),
    ServeStaticModule.forRoot({
      rootPath: '/frontend/build',
    }),
    AuthModule,
    UserModule,
  ],
  providers: [
    AppGateway,
    ChatGateway,
    SocketsService,
    GameGateway,
    UserGateway,
    JwtService,
    HistoryGateway,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.userRepository.update({}, { status: Status.OFFLINE });
  }
}
