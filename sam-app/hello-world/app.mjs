import aws from "aws-sdk";
const s3 = new aws.S3();

export const handler = async (event) => {
  const bucketName = process.env.bucket_name;
  const { image, description } = JSON.parse(event.body);
  const imageContent = Buffer.from(image, "base64");
  const params = {
    Bucket: bucketName,
    Key: Date.now().toString() + ".jpeg",
    Body: imageContent,
    ContentType: "image/jpeg",
    Metadata: {
      description: description,
    },
  };
  try {
    await s3.putObject(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Image uploaded successfully!" }),
    };
  } catch (error) {
    console.error("error in uploading image to s3", error || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify(error || error.message),
    };
  }
};
