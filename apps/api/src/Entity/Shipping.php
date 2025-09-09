<?php

namespace App\Entity;

use App\Repository\ShippingRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ShippingRepository::class)]
#[ORM\Table(name: 'shipping')]
class Shipping
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'uuid')]
    private ?string $id = null;

    #[ORM\ManyToOne(targetEntity: Supplier::class, inversedBy: 'deliveryZones')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Supplier $supplier = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 100)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::JSON)]
    private array $provinces = [];

    #[ORM\Column(type: Types::JSON)]
    private array $districts = [];

    #[ORM\Column(type: Types::DECIMAL, precision: 12, scale: 2)]
    #[Assert\NotBlank]
    #[Assert\PositiveOrZero]
    private ?string $baseCost = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 12, scale: 2, nullable: true)]
    #[Assert\PositiveOrZero]
    private ?string $costPerKm = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 12, scale: 2, nullable: true)]
    #[Assert\PositiveOrZero]
    private ?string $freeShippingThreshold = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Positive]
    private ?int $estimatedDays = null;

    #[ORM\Column]
    private bool $isActive = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getSupplier(): ?Supplier
    {
        return $this->supplier;
    }

    public function setSupplier(?Supplier $supplier): static
    {
        $this->supplier = $supplier;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getProvinces(): array
    {
        return $this->provinces;
    }

    public function setProvinces(array $provinces): static
    {
        $this->provinces = $provinces;
        return $this;
    }

    public function getDistricts(): array
    {
        return $this->districts;
    }

    public function setDistricts(array $districts): static
    {
        $this->districts = $districts;
        return $this;
    }

    public function getBaseCost(): ?string
    {
        return $this->baseCost;
    }

    public function setBaseCost(string $baseCost): static
    {
        $this->baseCost = $baseCost;
        return $this;
    }

    public function getCostPerKm(): ?string
    {
        return $this->costPerKm;
    }

    public function setCostPerKm(?string $costPerKm): static
    {
        $this->costPerKm = $costPerKm;
        return $this;
    }

    public function getFreeShippingThreshold(): ?string
    {
        return $this->freeShippingThreshold;
    }

    public function setFreeShippingThreshold(?string $freeShippingThreshold): static
    {
        $this->freeShippingThreshold = $freeShippingThreshold;
        return $this;
    }

    public function getEstimatedDays(): ?int
    {
        return $this->estimatedDays;
    }

    public function setEstimatedDays(int $estimatedDays): static
    {
        $this->estimatedDays = $estimatedDays;
        return $this;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function setActive(bool $isActive): static
    {
        $this->isActive = $isActive;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    public function coversProvince(string $province): bool
    {
        return in_array($province, $this->provinces);
    }

    public function coversDistrict(string $district): bool
    {
        return in_array($district, $this->districts);
    }

    public function calculateShippingCost(float $subtotal, ?float $distance = null): float
    {
        $cost = floatval($this->baseCost);

        if ($this->freeShippingThreshold && $subtotal >= floatval($this->freeShippingThreshold)) {
            return 0;
        }

        if ($this->costPerKm && $distance) {
            $cost += $distance * floatval($this->costPerKm);
        }

        return $cost;
    }
}
