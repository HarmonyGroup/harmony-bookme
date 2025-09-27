"use client";

import React from "react";
import { useLeisureListing, useDeleteLeisureListing } from "@/services/vendor/leisure";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

export default function LeisureListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: listing, isLoading, error } = useLeisureListing(id);
  const { mutate: deleteListing, isPending: deleting } = useDeleteLeisureListing();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteListing(id, {
        onSuccess: () => {
          toast.success("Listing deleted successfully");
          router.push("/vendor/leisure");
        },
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600">Error loading listing: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600">Listing not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/vendor/leisure">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge className={getStatusColor(listing.status || 'draft')}>
              {listing.status || 'draft'}
            </Badge>
            <span className="text-sm text-gray-500">
              Created {new Date(listing.createdAt || '').toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/vendor/leisure/${id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {listing.images.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {listing.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${listing.title} image ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={300}
                      height={300}
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            <p className="text-gray-700">{listing.description}</p>
          </div>

          {/* Highlights */}
          {listing.highlights.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {listing.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
            <p className="text-gray-700">{listing.requirements}</p>
          </div>

          {/* Inclusions */}
          {listing.inclusions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">What&apos;s Included</h2>
              <div className="flex flex-wrap gap-2">
                {listing.inclusions.map((inclusion, index) => (
                  <Badge key={index} variant="outline">
                    {inclusion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Terms and Conditions</h2>
            <p className="text-gray-700">{listing.termsAndConditions}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Quick Info</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Category:</span>
                <p className="text-gray-900">{listing.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Subcategory:</span>
                <p className="text-gray-900">{listing.subcategory}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Event Type:</span>
                <p className="text-gray-900 capitalize">{listing.eventDateType}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Age Restriction:</span>
                <p className="text-gray-900">{listing.ageRestriction}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Dress Code:</span>
                <p className="text-gray-900">{listing.dressCode}</p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Schedule</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Start Date:</span>
                <p className="text-gray-900">
                  {new Date(listing.startDate).toLocaleDateString()} at {listing.startTime}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">End Date:</span>
                <p className="text-gray-900">
                  {new Date(listing.endDate).toLocaleDateString()} at {listing.endTime}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Location</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Venue:</span>
                <p className="text-gray-900">{listing.venueName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Address:</span>
                <p className="text-gray-900">
                  {listing.addressDetails}<br />
                  {listing.city}, {listing.state} {listing.zipcode}<br />
                  {listing.country}
                </p>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Policies</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Children:</span>
                <p className="text-gray-900 capitalize">{listing.childrenPolicy}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Pets:</span>
                <p className="text-gray-900 capitalize">{listing.petPolicy}</p>
              </div>
              {listing.accessibilityFeatures.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Accessibility:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {listing.accessibilityFeatures.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {listing.tags.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tickets Section */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listing.tickets.map((ticket, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{ticket.name}</h3>
                <Badge variant="outline">
                  {ticket.pricingStructure === 'perPerson' ? 'Per Person' :
                   ticket.pricingStructure === 'perGroup' ? 'Per Group' : 'Flat Fee'}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${ticket.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{ticket.capacity}</span>
                </div>
                {ticket.hasDiscount && ticket.discountValue && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">
                      {ticket.discountType === 'percentage' ? `${ticket.discountValue}%` : `$${ticket.discountValue}`}
                    </span>
                  </div>
                )}
                {ticket.minimumBookingsRequired && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Bookings:</span>
                    <span className="font-medium">{ticket.minimumBookingsRequired}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
