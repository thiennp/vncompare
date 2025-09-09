<?php

namespace App\Controller\Api;

use App\Controller\BaseApiController;
use App\Entity\Address;
use App\Service\AddressService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/v1/addresses')]
class AddressController extends BaseApiController
{
    public function __construct(
        private AddressService $addressService
    ) {}

    #[Route('', name: 'api_addresses_list', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function list(): JsonResponse
    {
        try {
            $addresses = $this->addressService->getUserAddresses($this->getUser());
            
            return $this->successResponse([
                'addresses' => array_map([$this, 'serializeAddress'], $addresses)
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch addresses: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}', name: 'api_addresses_show', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function show(string $id): JsonResponse
    {
        try {
            $address = $this->addressService->getAddress($id, $this->getUser());
            
            if (!$address) {
                return $this->notFoundResponse('Address not found');
            }

            return $this->successResponse([
                'address' => $this->serializeAddress($address)
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch address: ' . $e->getMessage(), 500);
        }
    }

    #[Route('', name: 'api_addresses_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $address = $this->addressService->createAddress($this->getUser(), $data);
            
            return $this->successResponse([
                'address' => $this->serializeAddress($address)
            ], 'Address created successfully', 201);
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create address: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}', name: 'api_addresses_update', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function update(string $id, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $address = $this->addressService->updateAddress($id, $data, $this->getUser());
            
            if (!$address) {
                return $this->notFoundResponse('Address not found');
            }

            return $this->successResponse([
                'address' => $this->serializeAddress($address)
            ], 'Address updated successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->validationErrorResponse([$e->getMessage()]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update address: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}', name: 'api_addresses_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(string $id): JsonResponse
    {
        try {
            $deleted = $this->addressService->deleteAddress($id, $this->getUser());
            
            if (!$deleted) {
                return $this->notFoundResponse('Address not found');
            }

            return $this->successResponse(null, 'Address deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete address: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/{id}/default', name: 'api_addresses_set_default', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function setDefault(string $id): JsonResponse
    {
        try {
            $address = $this->addressService->setDefaultAddress($id, $this->getUser());
            
            if (!$address) {
                return $this->notFoundResponse('Address not found');
            }

            return $this->successResponse([
                'address' => $this->serializeAddress($address)
            ], 'Default address updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to set default address: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/provinces', name: 'api_addresses_provinces', methods: ['GET'])]
    public function getProvinces(): JsonResponse
    {
        try {
            $provinces = $this->addressService->getProvinces();
            
            return $this->successResponse([
                'provinces' => $provinces
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch provinces: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/provinces/{id}/districts', name: 'api_addresses_districts', methods: ['GET'])]
    public function getDistricts(string $id): JsonResponse
    {
        try {
            $districts = $this->addressService->getDistrictsByProvince($id);
            
            return $this->successResponse([
                'districts' => $districts
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch districts: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/districts/{id}/wards', name: 'api_addresses_wards', methods: ['GET'])]
    public function getWards(string $id): JsonResponse
    {
        try {
            $wards = $this->addressService->getWardsByDistrict($id);
            
            return $this->successResponse([
                'wards' => $wards
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch wards: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/validate', name: 'api_addresses_validate', methods: ['POST'])]
    public function validate(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->errorResponse('Invalid JSON data');
            }

            $result = $this->addressService->validateAddress($data);
            
            return $this->successResponse([
                'isValid' => $result['isValid'],
                'suggestions' => $result['suggestions'] ?? [],
                'coordinates' => $result['coordinates'] ?? null
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to validate address: ' . $e->getMessage(), 500);
        }
    }

    #[Route('/geocode', name: 'api_addresses_geocode', methods: ['GET'])]
    public function geocode(Request $request): JsonResponse
    {
        try {
            $address = $request->query->get('address');
            
            if (!$address) {
                return $this->errorResponse('Address parameter is required');
            }

            $coordinates = $this->addressService->geocodeAddress($address);
            
            return $this->successResponse([
                'coordinates' => $coordinates
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to geocode address: ' . $e->getMessage(), 500);
        }
    }

    private function serializeAddress(Address $address): array
    {
        return [
            'id' => $address->getId(),
            'type' => $address->getType(),
            'recipientName' => $address->getRecipientName(),
            'phone' => $address->getPhone(),
            'province' => $address->getProvince(),
            'district' => $address->getDistrict(),
            'ward' => $address->getWard(),
            'street' => $address->getStreet(),
            'houseNumber' => $address->getHouseNumber(),
            'postalCode' => $address->getPostalCode(),
            'isDefault' => $address->isDefault(),
            'coordinates' => $address->getCoordinates(),
            'fullAddress' => $address->getFullAddress(),
            'shortAddress' => $address->getShortAddress(),
            'createdAt' => $address->getCreatedAt()?->format('c'),
        ];
    }
}
