<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileUploadService
{
    public function __construct(
        private string $uploadDirectory,
        private SluggerInterface $slugger
    ) {}

    public function uploadFile(UploadedFile $file, string $directory = 'uploads'): string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        $file->move($this->uploadDirectory . '/' . $directory, $fileName);

        return $directory . '/' . $fileName;
    }

    public function deleteFile(string $filePath): void
    {
        $fullPath = $this->uploadDirectory . '/' . $filePath;
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }
}
