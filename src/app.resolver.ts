import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";
// import { UseInterceptors } from "@nestjs/common";
// import { SingleFileInterceptor } from "src/interceptors/request.inteceptors";

@Resolver()
export class AppResolver {

  @Mutation(returns => Boolean)
  // @UseInterceptors(SingleFileInterceptor('file'))
  async uploadFile(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload
  ) {
    try {
      // console.log(file)
      // const file_name = await this.uploadFileHelper(file);
      console.log(1)
      return true;
    } catch (error) {
      throw new Error(error.message);
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
