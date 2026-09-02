import 'package:equatable/equatable.dart';

class Address extends Equatable {
  final String id;
  final String label;
  final String fullAddress;
  final String? street;
  final String? building;
  final String? floor;
  final String? apartment;
  final String? landmark;
  final String? city;
  final String? state;
  final String country;
  final String? postalCode;
  final double? latitude;
  final double? longitude;
  final bool isDefault;

  const Address({
    required this.id,
    this.label = 'Home',
    required this.fullAddress,
    this.street,
    this.building,
    this.floor,
    this.apartment,
    this.landmark,
    this.city,
    this.state,
    this.country = 'EG',
    this.postalCode,
    this.latitude,
    this.longitude,
    this.isDefault = false,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      id: json['id'] ?? '',
      label: json['label'] ?? 'Home',
      fullAddress: json['full_address'] ?? '',
      street: json['street'],
      building: json['building'],
      floor: json['floor'],
      apartment: json['apartment'],
      landmark: json['landmark'],
      city: json['city'],
      state: json['state'],
      country: json['country'] ?? 'EG',
      postalCode: json['postal_code'],
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
      isDefault: json['is_default'] ?? false,
    );
  }

  @override
  List<Object?> get props => [id, label, fullAddress, isDefault];
}
