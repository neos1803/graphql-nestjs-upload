import { BadRequestException, CallHandler, Injectable, NestInterceptor, Type } from "@nestjs/common";
import { GraphQLExecutionContext } from "@nestjs/graphql";
import { Observable, throwError } from "rxjs";
import { tap } from "rxjs/operators";
import * as fs from "fs";

// export function SingleFileInterceptor(type?: string, maxSize?: number): Type<NestInterceptor> {
  
//   class RequestInterceptor implements NestInterceptor {
//     intercept(
//       context: GraphQLExecutionContext,
//       next: CallHandler
//     ): Observable<any> {
//       const [
//         _,
//         payloads,
//         {
//           req: {
//             body: { query },
//             // ipInfo: { ip, country }
//           }
//         },
//         {
//           fieldNodes,
//           variableValues
//         }
//       ] = context.getArgs();
//       console.log(payloads.file)
//       // const stream = await Promise.resolve(payloads.file).then((v) => {
//       //   return v.createReadStream()
//       // });
//       // fileSizeValidation(1000000, stream, (error, status) => {
//       //   if (!status) {
//       //     throw new BadRequestException('File melebihi limit');
//       //     // return next.handle().pipe(tap(() => throwError('File melebihi limit')))
//       //   }
//       // });
//       return next.handle().pipe();
//     }
//   }

//   return RequestInterceptor;
// }

function fileSizeValidation(size?: number, stream?: any, callback?) {

  let bytes=0;

  stream.on("data", (chunk) => {
    bytes += chunk.length;
  });

  stream.on("end", () => {
    // console.log('end :', bytes);
    if (bytes > 600000) {
      callback(null, false);
    } else {
      callback(null, true);
    }
  });

}