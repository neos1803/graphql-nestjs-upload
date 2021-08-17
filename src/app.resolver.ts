import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";

@Resolver()
export class AppResolver {

  @Mutation(returns => Boolean)
  async uploadFile(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload
  ) {
    console.log(file)
    const file_name = await this.uploadFileHelper(file);
    return true;
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
