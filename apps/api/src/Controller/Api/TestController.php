<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Repository\SupplierRepository;
use App\Repository\UserRepository;
use App\Repository\AddressRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/v1/test')]
class TestController extends BaseApiController
{
    public function __construct(
        private SupplierRepository $supplierRepository,
        private UserRepository $userRepository,
        private AddressRepository $addressRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }
    #[Route('/suppliers', name: 'api_test_suppliers', methods: ['GET'])]
    public function getSuppliers(): JsonResponse
    {
        // Debug: Log that we're using database
        error_log('TestController: Using database for suppliers');
        $suppliers = $this->supplierRepository->findAll();
        error_log('TestController: Found ' . count($suppliers) . ' suppliers in database');
        
        $suppliersData = array_map(function ($supplier) {
            return [
                'id' => $supplier->getId(),
                'companyName' => $supplier->getCompanyName(),
                'description' => $supplier->getDescription(),
                'logo' => $supplier->getLogo(),
                'website' => $supplier->getWebsite(),
                'isVerified' => $supplier->isVerified(),
                'rating' => $supplier->getRating(),
                'totalReviews' => $supplier->getTotalReviews(),
                'serviceAreas' => $supplier->getServiceAreas(),
                'totalProducts' => $supplier->getTotalProducts(),
                'activeProducts' => $supplier->getActiveProducts(),
                'createdAt' => $supplier->getCreatedAt()?->format('c'),
            ];
        }, $suppliers);

        return $this->successResponse([
            'suppliers' => $suppliersData,
            'pagination' => [
                'page' => 1,
                'limit' => 50,
                'total' => count($suppliersData),
                'totalPages' => 1,
            ]
        ]);
    }

    #[Route('/suppliers', name: 'api_test_create_supplier', methods: ['POST'])]
    public function createSupplier(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data', 400);
            }

            // Validate required fields
            $requiredFields = ['email', 'firstName', 'lastName', 'password', 'companyName', 'businessLicense', 'taxCode'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    return $this->errorResponse("Missing required field: {$field}", 400);
                }
            }

            // Check if email already exists
            $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
            if ($existingUser) {
                return $this->errorResponse('Email already exists', 409);
            }

            // Create a new User entity for the supplier
            $user = new \App\Entity\User();
            $user->setEmail($data['email']);
            $user->setFirstName($data['firstName']);
            $user->setLastName($data['lastName']);
            $user->setPhone($data['phone'] ?? null);
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
            $user->setRoles(['ROLE_SUPPLIER']);
            $user->setActive($data['isActive'] ?? true);
            $user->setEmailVerified($data['emailVerified'] ?? false);
            $user->setPhoneVerified($data['phoneVerified'] ?? false);
            $user->setCreatedAt(new \DateTime());

            // Create a new Supplier entity
            $supplier = new \App\Entity\Supplier();
            $supplier->setUser($user);
            $supplier->setCompanyName($data['companyName']);
            $supplier->setBusinessLicense($data['businessLicense']);
            $supplier->setTaxCode($data['taxCode']);
            $supplier->setDescription($data['description'] ?? '');
            $supplier->setLogo($data['logo'] ?? null);
            $supplier->setWebsite($data['website'] ?? null);
            $supplier->setVerified($data['isVerified'] ?? false);
            $supplier->setRating($data['rating'] ?? null);
            $supplier->setTotalReviews($data['totalReviews'] ?? 0);
            $supplier->setServiceAreas($data['serviceAreas'] ?? []);
            $supplier->setCreatedAt(new \DateTime());

            // Create address if address data is provided
            $address = null;
            if (isset($data['address']) && !empty($data['address'])) {
                $address = new \App\Entity\Address();
                $address->setUser($user);
                $address->setType($data['addressType'] ?? 'WORK');
                $address->setRecipientName($data['firstName'] . ' ' . $data['lastName']);
                $address->setPhone($data['phone'] ?? '');
                $address->setStreet($data['address']);
                $address->setHouseNumber($data['houseNumber'] ?? '1');
                $address->setWard($data['ward'] ?? '');
                $address->setDistrict($data['district'] ?? '');
                $address->setProvince($data['province'] ?? '');
                $address->setPostalCode($data['postalCode'] ?? null);
                $address->setDefault($data['isDefault'] ?? true);
                $address->setCoordinates($data['coordinates'] ?? null);
                $address->setCreatedAt(new \DateTime());
                $address->setUpdatedAt(new \DateTime());
            }

            // Save to database
            $this->entityManager->persist($user);
            $this->entityManager->persist($supplier);
            if ($address) {
                $this->entityManager->persist($address);
            }
            $this->entityManager->flush();

            // Return the created supplier data
            $supplierData = [
                'id' => (string) $supplier->getId(),
                'companyName' => $supplier->getCompanyName(),
                'description' => $supplier->getDescription(),
                'logo' => $supplier->getLogo(),
                'website' => $supplier->getWebsite(),
                'isVerified' => $supplier->isVerified(),
                'rating' => $supplier->getRating(),
                'totalReviews' => $supplier->getTotalReviews(),
                'serviceAreas' => $supplier->getServiceAreas(),
                'totalProducts' => $supplier->getTotalProducts(),
                'activeProducts' => $supplier->getActiveProducts(),
                'createdAt' => $supplier->getCreatedAt()?->format('c'),
            ];

            return $this->successResponse([
                'supplier' => $supplierData
            ], 'Supplier created successfully', 201);

        } catch (\Exception $e) {
            error_log('Error creating supplier: ' . $e->getMessage());
            return $this->errorResponse('Failed to create supplier: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/suppliers/{id}/verify', name: 'api_test_verify_supplier', methods: ['POST'])]
    public function verifySupplier(string $id): JsonResponse
    {
        // Find the supplier in the database
        $supplier = $this->supplierRepository->find($id);
        
        if (!$supplier) {
            return $this->errorResponse('Supplier not found', 404);
        }

        // Update supplier verification status
        $supplier->setVerified(true);
        $supplier->setRating('4.0');
        
        // Save changes to database
        $this->entityManager->flush();

        // Return the updated supplier data
        $supplierData = [
            'id' => (string) $supplier->getId(),
            'companyName' => $supplier->getCompanyName(),
            'description' => $supplier->getDescription(),
            'logo' => $supplier->getLogo(),
            'website' => $supplier->getWebsite(),
            'isVerified' => $supplier->isVerified(),
            'rating' => $supplier->getRating(),
            'totalReviews' => $supplier->getTotalReviews(),
            'serviceAreas' => $supplier->getServiceAreas(),
            'totalProducts' => $supplier->getTotalProducts(),
            'activeProducts' => $supplier->getActiveProducts(),
            'createdAt' => $supplier->getCreatedAt()?->format('c'),
        ];

        return $this->successResponse([
            'supplier' => $supplierData
        ], 'Supplier verification updated successfully');
    }

    #[Route('/users', name: 'api_test_users', methods: ['GET'], options: ['trailing_slash_on_root' => false])]
    public function getUsers(): JsonResponse
    {
        $users = $this->userRepository->findAll();
        
        $usersData = array_map(function ($user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'phone' => $user->getPhone(),
                'role' => $user->getRoles()[0] ?? 'USER',
                'isActive' => $user->isActive(),
                'emailVerified' => $user->isEmailVerified(),
                'phoneVerified' => $user->isPhoneVerified(),
                'createdAt' => $user->getCreatedAt()?->format('c'),
                'lastLoginAt' => $user->getLastLoginAt()?->format('c'),
            ];
        }, $users);

        return $this->successResponse([
            'users' => $usersData,
            'pagination' => [
                'page' => 1,
                'limit' => 50,
                'total' => count($usersData),
                'totalPages' => 1,
            ]
        ]);
    }

    #[Route('/users', name: 'api_test_create_user', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data', 400);
            }

            // Validate required fields
            $requiredFields = ['email', 'firstName', 'lastName', 'password'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    return $this->errorResponse("Missing required field: {$field}", 400);
                }
            }

            // Check if email already exists
            $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
            if ($existingUser) {
                return $this->errorResponse('Email already exists', 409);
            }

            // Create a new User entity
            $user = new \App\Entity\User();
            $user->setEmail($data['email']);
            $user->setFirstName($data['firstName']);
            $user->setLastName($data['lastName']);
            $user->setPhone($data['phone'] ?? null);
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
            $user->setRoles([$data['role'] ?? 'ROLE_USER']);
            $user->setActive($data['isActive'] ?? true);
            $user->setEmailVerified($data['emailVerified'] ?? false);
            $user->setPhoneVerified($data['phoneVerified'] ?? false);
            $user->setCreatedAt(new \DateTime());

            // Save to database
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // Return the created user data
            $userData = [
                'id' => (string) $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'phone' => $user->getPhone(),
                'role' => $user->getRoles()[0] ?? 'USER',
                'isActive' => $user->isActive(),
                'emailVerified' => $user->isEmailVerified(),
                'phoneVerified' => $user->isPhoneVerified(),
                'createdAt' => $user->getCreatedAt()?->format('c'),
                'lastLoginAt' => $user->getLastLoginAt()?->format('c'),
            ];

            return $this->successResponse([
                'user' => $userData
            ], 'User created successfully', 201);

        } catch (\Exception $e) {
            error_log('Error creating user: ' . $e->getMessage());
            return $this->errorResponse('Failed to create user: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/addresses', name: 'api_test_addresses', methods: ['GET'])]
    public function getAddresses(): JsonResponse
    {
        $addresses = $this->addressRepository->findAll();
        
        $addressesData = array_map(function ($address) {
            return [
                'id' => $address->getId(),
                'street' => $address->getStreet(),
                'ward' => $address->getWard(),
                'district' => $address->getDistrict(),
                'province' => $address->getProvince(),
                'postalCode' => $address->getPostalCode(),
                'isServiceArea' => $address->isServiceArea(),
                'deliveryFee' => $address->getDeliveryFee(),
                'estimatedDays' => $address->getEstimatedDays(),
                'createdAt' => $address->getCreatedAt()?->format('c'),
                'updatedAt' => $address->getUpdatedAt()?->format('c'),
            ];
        }, $addresses);

        return $this->successResponse([
            'addresses' => $addressesData,
            'pagination' => [
                'page' => 1,
                'limit' => 50,
                'total' => count($addressesData),
                'totalPages' => 1,
            ]
        ]);
    }

    #[Route('/addresses', name: 'api_test_create_address', methods: ['POST'])]
    public function createAddress(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data', 400);
            }

            // Validate required fields
            $requiredFields = ['street', 'ward', 'district', 'province'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    return $this->errorResponse("Missing required field: {$field}", 400);
                }
            }

            // Create a new Address entity
            $address = new \App\Entity\Address();
            $address->setStreet($data['street']);
            $address->setWard($data['ward']);
            $address->setDistrict($data['district']);
            $address->setProvince($data['province']);
            $address->setPostalCode($data['postalCode'] ?? null);
            $address->setIsServiceArea($data['isServiceArea'] ?? false);
            $address->setDeliveryFee($data['deliveryFee'] ?? 0);
            $address->setEstimatedDays($data['estimatedDays'] ?? 1);
            $address->setCreatedAt(new \DateTime());
            $address->setUpdatedAt(new \DateTime());

            // Save to database
            $this->entityManager->persist($address);
            $this->entityManager->flush();

            // Return the created address data
            $addressData = [
                'id' => (string) $address->getId(),
                'street' => $address->getStreet(),
                'ward' => $address->getWard(),
                'district' => $address->getDistrict(),
                'province' => $address->getProvince(),
                'postalCode' => $address->getPostalCode(),
                'isServiceArea' => $address->isServiceArea(),
                'deliveryFee' => $address->getDeliveryFee(),
                'estimatedDays' => $address->getEstimatedDays(),
                'createdAt' => $address->getCreatedAt()?->format('c'),
                'updatedAt' => $address->getUpdatedAt()?->format('c'),
            ];

            return $this->successResponse([
                'address' => $addressData
            ], 'Address created successfully', 201);

        } catch (\Exception $e) {
            error_log('Error creating address: ' . $e->getMessage());
            return $this->errorResponse('Failed to create address: ' . $e->getMessage(), 500);
        }
    }
}
