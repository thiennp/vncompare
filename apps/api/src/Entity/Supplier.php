<?php

namespace App\Entity;

use App\Repository\SupplierRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: SupplierRepository::class)]
#[ORM\Table(name: 'suppliers')]
#[ORM\UniqueConstraint(name: 'UNIQ_BUSINESS_LICENSE', fields: ['businessLicense'])]
#[ORM\UniqueConstraint(name: 'UNIQ_TAX_CODE', fields: ['taxCode'])]
class Supplier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\OneToOne(targetEntity: User::class, inversedBy: 'supplier', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 255)]
    private ?string $companyName = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 5, max: 50)]
    private ?string $businessLicense = null;

    #[ORM\Column(length: 20, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 10, max: 20)]
    private ?string $taxCode = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $logo = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Url]
    private ?string $website = null;

    #[ORM\Column]
    private bool $isVerified = false;

    #[ORM\Column(type: Types::DECIMAL, precision: 3, scale: 2, nullable: true)]
    private ?string $rating = null;

    #[ORM\Column]
    private int $totalReviews = 0;

    #[ORM\Column(type: Types::JSON)]
    private array $serviceAreas = [];

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\OneToMany(targetEntity: Product::class, mappedBy: 'supplier')]
    private Collection $products;

    #[ORM\OneToMany(targetEntity: Order::class, mappedBy: 'supplier')]
    private Collection $orders;

    #[ORM\OneToMany(targetEntity: Shipping::class, mappedBy: 'supplier', cascade: ['persist', 'remove'])]
    private Collection $deliveryZones;

    #[ORM\OneToMany(targetEntity: SupplierDocument::class, mappedBy: 'supplier', cascade: ['persist', 'remove'])]
    private Collection $documents;

    public function __construct()
    {
        $this->products = new ArrayCollection();
        $this->orders = new ArrayCollection();
        $this->deliveryZones = new ArrayCollection();
        $this->documents = new ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?string
    {
        return $this->id;
    }


    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getCompanyName(): ?string
    {
        return $this->companyName;
    }

    public function setCompanyName(string $companyName): static
    {
        $this->companyName = $companyName;
        return $this;
    }

    public function getBusinessLicense(): ?string
    {
        return $this->businessLicense;
    }

    public function setBusinessLicense(string $businessLicense): static
    {
        $this->businessLicense = $businessLicense;
        return $this;
    }

    public function getTaxCode(): ?string
    {
        return $this->taxCode;
    }

    public function setTaxCode(string $taxCode): static
    {
        $this->taxCode = $taxCode;
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

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(?string $logo): static
    {
        $this->logo = $logo;
        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): static
    {
        $this->website = $website;
        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;
        return $this;
    }

    public function getRating(): ?string
    {
        return $this->rating;
    }

    public function setRating(?string $rating): static
    {
        $this->rating = $rating;
        return $this;
    }

    public function getTotalReviews(): int
    {
        return $this->totalReviews;
    }

    public function setTotalReviews(int $totalReviews): static
    {
        $this->totalReviews = $totalReviews;
        return $this;
    }

    public function getServiceAreas(): array
    {
        return $this->serviceAreas;
    }

    public function setServiceAreas(array $serviceAreas): static
    {
        $this->serviceAreas = $serviceAreas;
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

    /**
     * @return Collection<int, Product>
     */
    public function getProducts(): Collection
    {
        return $this->products;
    }

    public function addProduct(Product $product): static
    {
        if (!$this->products->contains($product)) {
            $this->products->add($product);
            $product->setSupplier($this);
        }

        return $this;
    }

    public function removeProduct(Product $product): static
    {
        if ($this->products->removeElement($product)) {
            // set the owning side to null (unless already changed)
            if ($product->getSupplier() === $this) {
                $product->setSupplier(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Order>
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }

    public function addOrder(Order $order): static
    {
        if (!$this->orders->contains($order)) {
            $this->orders->add($order);
            $order->setSupplier($this);
        }

        return $this;
    }

    public function removeOrder(Order $order): static
    {
        if ($this->orders->removeElement($order)) {
            // set the owning side to null (unless already changed)
            if ($order->getSupplier() === $this) {
                $order->setSupplier(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Shipping>
     */
    public function getDeliveryZones(): Collection
    {
        return $this->deliveryZones;
    }

    public function addDeliveryZone(Shipping $deliveryZone): static
    {
        if (!$this->deliveryZones->contains($deliveryZone)) {
            $this->deliveryZones->add($deliveryZone);
            $deliveryZone->setSupplier($this);
        }

        return $this;
    }

    public function removeDeliveryZone(Shipping $deliveryZone): static
    {
        if ($this->deliveryZones->removeElement($deliveryZone)) {
            // set the owning side to null (unless already changed)
            if ($deliveryZone->getSupplier() === $this) {
                $deliveryZone->setSupplier(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, SupplierDocument>
     */
    public function getDocuments(): Collection
    {
        return $this->documents;
    }

    public function addDocument(SupplierDocument $document): static
    {
        if (!$this->documents->contains($document)) {
            $this->documents->add($document);
            $document->setSupplier($this);
        }

        return $this;
    }

    public function removeDocument(SupplierDocument $document): static
    {
        if ($this->documents->removeElement($document)) {
            // set the owning side to null (unless already changed)
            if ($document->getSupplier() === $this) {
                $document->setSupplier(null);
            }
        }

        return $this;
    }

    public function getTotalProducts(): int
    {
        return $this->products->count();
    }

    public function getActiveProducts(): int
    {
        return $this->products->filter(fn(Product $product) => $product->isActive())->count();
    }

    public function updateRating(): void
    {
        $reviews = [];
        foreach ($this->products as $product) {
            foreach ($product->getReviews() as $review) {
                $reviews[] = $review->getRating();
            }
        }

        if (empty($reviews)) {
            $this->rating = null;
            $this->totalReviews = 0;
            return;
        }

        $this->rating = (string) round(array_sum($reviews) / count($reviews), 2);
        $this->totalReviews = count($reviews);
    }
}
