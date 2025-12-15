import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class LowercaseEmailPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && value.email) {
      value.email = value.email.toLowerCase();
    }
    return value;
  }
}
