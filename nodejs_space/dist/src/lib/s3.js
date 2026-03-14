"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePresignedUploadUrl = generatePresignedUploadUrl;
exports.initiateMultipartUpload = initiateMultipartUpload;
exports.getPresignedUrlForPart = getPresignedUrlForPart;
exports.completeMultipartUpload = completeMultipartUpload;
exports.getFileUrl = getFileUrl;
exports.deleteFile = deleteFile;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const aws_config_1 = require("./aws-config");
async function generatePresignedUploadUrl(fileName, contentType, isPublic = false) {
    const s3Client = (0, aws_config_1.createS3Client)();
    const { bucketName, folderPrefix } = (0, aws_config_1.getBucketConfig)();
    const prefix = isPublic ? 'public/uploads' : 'uploads';
    const cloud_storage_path = `${folderPrefix}${prefix}/${Date.now()}-${fileName}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: bucketName,
        Key: cloud_storage_path,
        ContentDisposition: isPublic ? 'attachment' : undefined,
    });
    const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, {
        expiresIn: 3600,
    });
    return { uploadUrl, cloud_storage_path };
}
async function initiateMultipartUpload(fileName, contentType, isPublic = false) {
    const s3Client = (0, aws_config_1.createS3Client)();
    const { bucketName, folderPrefix } = (0, aws_config_1.getBucketConfig)();
    const prefix = isPublic ? 'public/uploads' : 'uploads';
    const cloud_storage_path = `${folderPrefix}${prefix}/${Date.now()}-${fileName}`;
    const command = new client_s3_1.CreateMultipartUploadCommand({
        Bucket: bucketName,
        Key: cloud_storage_path,
        ContentType: contentType,
        ContentDisposition: isPublic ? 'attachment' : undefined,
    });
    const result = await s3Client.send(command);
    return { uploadId: result.UploadId, cloud_storage_path };
}
async function getPresignedUrlForPart(cloud_storage_path, uploadId, partNumber) {
    const s3Client = (0, aws_config_1.createS3Client)();
    const { bucketName } = (0, aws_config_1.getBucketConfig)();
    const command = new client_s3_1.UploadPartCommand({
        Bucket: bucketName,
        Key: cloud_storage_path,
        UploadId: uploadId,
        PartNumber: partNumber,
    });
    return await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 });
}
async function completeMultipartUpload(cloud_storage_path, uploadId, parts) {
    const s3Client = (0, aws_config_1.createS3Client)();
    const { bucketName } = (0, aws_config_1.getBucketConfig)();
    const command = new client_s3_1.CompleteMultipartUploadCommand({
        Bucket: bucketName,
        Key: cloud_storage_path,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
    });
    await s3Client.send(command);
}
async function getFileUrl(cloud_storage_path, isPublic) {
    const s3Client = (0, aws_config_1.createS3Client)();
    const { bucketName } = (0, aws_config_1.getBucketConfig)();
    if (isPublic) {
        const region = await s3Client.config.region();
        return `https://${bucketName}.s3.${region}.amazonaws.com/${cloud_storage_path}`;
    }
    else {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: bucketName,
            Key: cloud_storage_path,
            ResponseContentDisposition: 'attachment',
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 });
    }
}
async function deleteFile(cloud_storage_path) {
    const s3Client = (0, aws_config_1.createS3Client)();
    const { bucketName } = (0, aws_config_1.getBucketConfig)();
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: bucketName,
        Key: cloud_storage_path,
    });
    await s3Client.send(command);
}
//# sourceMappingURL=s3.js.map