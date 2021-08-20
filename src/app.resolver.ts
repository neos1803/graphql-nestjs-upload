import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { fileSizeValidation } from "./utils/validation";

@Resolver()
export class AppResolver {

  @Mutation(returns => Boolean)
  async uploadFile(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload
  ) {
    try {
      if (file.filename.split(".").pop() != 'png') throw new BadRequestException("File type musst be png");
      await fileSizeValidation(file.createReadStream(), 1000).catch((e) => {
        throw new BadRequestException(e)
      });

      const file_name = await this.uploadFileHelper(file);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private uploadFileHelper({ createReadStream, encoding, filename, mimetype }: FileUpload): Promise<string> {
    console.log(mimetype);
    const fName = `${Date.now()}-file.${mimetype.split('/')[1]}`
    const upload: Promise<string> = new Promise((resolve, reject) => createReadStream()
      .pipe(createWriteStream('public/file/' + fName))
      .on('finish', async () => {
        resolve(fName)        
      })
      .on('error', (err) => {
        reject(err)
      })
    )

    return upload
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

}
