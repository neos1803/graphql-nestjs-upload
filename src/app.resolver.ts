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
      if (file.filename.split(".").pop() != 'png') throw new BadRequestException("File type must be png");
      await fileSizeValidation(file.createReadStream(), 1000).catch((e) => {
        throw new BadRequestException(e)
      });

      const file_name = await this.uploadFileHelper(file, 'file');
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private uploadFileHelper({ createReadStream, encoding, filename, mimetype }: FileUpload, field: string): Promise<string> {
    console.log(mimetype);
    const fName = `${Date.now()}-file.${mimetype.split('/')[1]}`
    const upload: Promise<string> = new Promise((resolve, reject) => createReadStream()
      .pipe(createWriteStream(`public/${field}/` + fName))
      .on('finish', async () => {
        resolve(fName)        
      })
      .on('error', (err) => {
        reject(err)
      })
    )

    return upload
  }

  @Mutation(returns => Boolean)
  async multipleFieldUpload(
    @Args('photo', { type: () => GraphQLUpload, nullable: true }) photo: FileUpload,
    @Args('document', { type: () => GraphQLUpload, nullable: true }) document: FileUpload,
  ) {
    try {
      if (photo.filename.split(".").pop() != 'png') throw new BadRequestException("Photo type must be png");
      await fileSizeValidation(photo.createReadStream(), 1000).catch((e) => {
        throw new BadRequestException(e)
      });

      if (document.filename.split(".").pop() != 'pdf') throw new BadRequestException("Document type musst be pdf");
      await fileSizeValidation(document.createReadStream(), 1000).catch((e) => {
        throw new BadRequestException(e)
      });

      await this.uploadFileHelper(photo, 'photo');
      await this.uploadFileHelper(document, 'document');
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

}
