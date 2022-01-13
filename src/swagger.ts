import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { version } from '../package.json';

const TITLE = 'Template';
const DESCRIPTION = 'The Template API description';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle(TITLE)
    .setDescription(DESCRIPTION)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
