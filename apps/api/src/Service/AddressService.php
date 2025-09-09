<?php

namespace App\Service;

use App\Entity\Address;
use App\Repository\AddressRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class AddressService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AddressRepository $addressRepository
    ) {}

    public function getUserAddresses(UserInterface $user): array
    {
        return $this->addressRepository->findBy(['user' => $user], ['createdAt' => 'DESC']);
    }

    public function getAddress(string $id, UserInterface $user): ?Address
    {
        return $this->addressRepository->findOneBy(['id' => $id, 'user' => $user]);
    }

    public function createAddress(UserInterface $user, array $data): Address
    {
        $address = new Address();
        $address->setUser($user);
        $address->setType($data['type']);
        $address->setRecipientName($data['recipientName']);
        $address->setPhone($data['phone']);
        $address->setProvince($data['province']);
        $address->setDistrict($data['district']);
        $address->setWard($data['ward']);
        $address->setStreet($data['street']);
        $address->setHouseNumber($data['houseNumber']);
        $address->setPostalCode($data['postalCode'] ?? null);
        $address->setDefault($data['isDefault'] ?? false);

        // If this is set as default, unset other defaults
        if ($address->isDefault()) {
            $this->unsetOtherDefaults($user);
        }

        $this->entityManager->persist($address);
        $this->entityManager->flush();

        return $address;
    }

    public function updateAddress(string $id, array $data, UserInterface $user): ?Address
    {
        $address = $this->getAddress($id, $user);
        
        if (!$address) {
            return null;
        }

        if (isset($data['type'])) {
            $address->setType($data['type']);
        }
        if (isset($data['recipientName'])) {
            $address->setRecipientName($data['recipientName']);
        }
        if (isset($data['phone'])) {
            $address->setPhone($data['phone']);
        }
        if (isset($data['province'])) {
            $address->setProvince($data['province']);
        }
        if (isset($data['district'])) {
            $address->setDistrict($data['district']);
        }
        if (isset($data['ward'])) {
            $address->setWard($data['ward']);
        }
        if (isset($data['street'])) {
            $address->setStreet($data['street']);
        }
        if (isset($data['houseNumber'])) {
            $address->setHouseNumber($data['houseNumber']);
        }
        if (isset($data['postalCode'])) {
            $address->setPostalCode($data['postalCode']);
        }
        if (isset($data['isDefault'])) {
            $address->setDefault($data['isDefault']);
            if ($address->isDefault()) {
                $this->unsetOtherDefaults($user, $address);
            }
        }

        $address->setUpdatedAt(new \DateTime());
        $this->entityManager->flush();

        return $address;
    }

    public function deleteAddress(string $id, UserInterface $user): bool
    {
        $address = $this->getAddress($id, $user);
        
        if (!$address) {
            return false;
        }

        $this->entityManager->remove($address);
        $this->entityManager->flush();

        return true;
    }

    public function setDefaultAddress(string $id, UserInterface $user): ?Address
    {
        $address = $this->getAddress($id, $user);
        
        if (!$address) {
            return null;
        }

        $this->unsetOtherDefaults($user, $address);
        $address->setDefault(true);
        $this->entityManager->flush();

        return $address;
    }

    public function getProvinces(): array
    {
        // In a real implementation, this would come from a database
        return [
            ['id' => '01', 'name' => 'Hà Nội'],
            ['id' => '02', 'name' => 'Hồ Chí Minh'],
            ['id' => '03', 'name' => 'Đà Nẵng'],
            // ... more provinces
        ];
    }

    public function getDistrictsByProvince(string $provinceId): array
    {
        // In a real implementation, this would come from a database
        return [
            ['id' => '001', 'name' => 'Quận 1'],
            ['id' => '002', 'name' => 'Quận 2'],
            // ... more districts
        ];
    }

    public function getWardsByDistrict(string $districtId): array
    {
        // In a real implementation, this would come from a database
        return [
            ['id' => '00001', 'name' => 'Phường Bến Nghé'],
            ['id' => '00002', 'name' => 'Phường Bến Thành'],
            // ... more wards
        ];
    }

    public function validateAddress(array $data): array
    {
        // In a real implementation, this would validate against a real address database
        return [
            'isValid' => true,
            'suggestions' => [],
            'coordinates' => ['lat' => 10.7769, 'lng' => 106.7009]
        ];
    }

    public function geocodeAddress(string $address): ?array
    {
        // In a real implementation, this would use Google Maps API or similar
        return ['lat' => 10.7769, 'lng' => 106.7009];
    }

    private function unsetOtherDefaults(UserInterface $user, ?Address $exclude = null): void
    {
        $addresses = $this->addressRepository->findBy(['user' => $user, 'isDefault' => true]);
        
        foreach ($addresses as $address) {
            if ($exclude && $address->getId() === $exclude->getId()) {
                continue;
            }
            $address->setDefault(false);
        }
    }
}
