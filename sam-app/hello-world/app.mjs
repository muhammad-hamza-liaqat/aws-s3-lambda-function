import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const lambdaHandler = async (event) => {
    console.log('Received event:', JSON.stringify(event));

    try {
        const bucketName = process.env.bucket_name;
        console.log('Bucket name:', bucketName);
        const { image, description } = JSON.parse(event.body);
        const imageContent = Buffer.from(image, 'base64');
        console.log('Description:', description);

        const params = {
            Bucket: bucketName,
            Key: decodeURIComponent(Date.now().toString() + '.png'), 
            Body: imageContent,
            ContentType: 'image/png', 
            Metadata: {
                description: description,
            },
        };

        console.log('Uploading image to S3:', JSON.stringify(params));

        await s3.putObject(params).promise();

        console.log('Image uploaded successfully');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Image uploaded successfully!' }),
        };
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading image to S3' }),
        };
    }
};
