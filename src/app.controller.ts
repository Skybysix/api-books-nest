import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()  //Define que es un controlador
export class AppController {
  constructor(private readonly appService: AppService) {}  //Pide el servicio para poder usarlo en el controlador

  @Get()  //Conseguir algo de la ruta raíz
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/ping')  //Aqui NO ponemos get.json() porque no es un endpoint de tipo json, es un endpoint de tipo get
  ping(): { pong: boolean } {
    return { pong: true };
  }
}
