<?php

namespace App\Entity;

use App\Repository\PriceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: PriceRepository::class)]
#[ORM\Table(name: 'prices')]
class Price
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Product::class, inversedBy: 'prices')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Product $product = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 12, scale: 2)]
    #[Assert\NotBlank]
    #[Assert\PositiveOrZero]
    private ?string $price = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 12, scale: 2, nullable: true)]
    #[Assert\PositiveOrZero]
    private ?string $discountPrice = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $effectiveFrom = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $effectiveTo = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->effectiveFrom = new \DateTime();
    }

    public function getId(): ?string
    {
        return $this->id;
    }


    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;
        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;
        return $this;
    }

    public function getDiscountPrice(): ?string
    {
        return $this->discountPrice;
    }

    public function setDiscountPrice(?string $discountPrice): static
    {
        $this->discountPrice = $discountPrice;
        return $this;
    }

    public function getEffectiveFrom(): ?\DateTimeInterface
    {
        return $this->effectiveFrom;
    }

    public function setEffectiveFrom(\DateTimeInterface $effectiveFrom): static
    {
        $this->effectiveFrom = $effectiveFrom;
        return $this;
    }

    public function getEffectiveTo(): ?\DateTimeInterface
    {
        return $this->effectiveTo;
    }

    public function setEffectiveTo(?\DateTimeInterface $effectiveTo): static
    {
        $this->effectiveTo = $effectiveTo;
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

    public function getCurrentPrice(): string
    {
        return $this->discountPrice ?? $this->price;
    }

    public function isActive(): bool
    {
        $now = new \DateTime();
        return $this->effectiveFrom <= $now && 
               ($this->effectiveTo === null || $this->effectiveTo >= $now);
    }
}
