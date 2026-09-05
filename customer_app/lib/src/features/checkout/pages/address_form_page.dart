import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:nova_core/nova_core.dart';
import '../../addresses/bloc/address_bloc.dart';
import '../../addresses/bloc/address_event.dart';
import '../../addresses/bloc/address_state.dart';

class AddressFormPage extends StatefulWidget {
  const AddressFormPage({super.key});

  @override
  State<AddressFormPage> createState() => _AddressFormPageState();
}

class _AddressFormPageState extends State<AddressFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _searchController = TextEditingController();
  final _fullAddressController = TextEditingController();
  final _streetController = TextEditingController();
  final _buildingController = TextEditingController();
  final _floorController = TextEditingController();
  final _apartmentController = TextEditingController();
  final _landmarkController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();

  String _selectedLabel = 'Home';
  bool _isLoading = false;
  double? _latitude;
  double? _longitude;
  List<Map<String, dynamic>> _autocompleteResults = [];

  static const String _googleMapsApiKey = 'AlzaSyD9W-FwHKKQsp-KKEYXSvqKutCTsauk-3U';

  final List<String> _labelOptions = ['Home', 'Work', 'Other'];

  @override
  void dispose() {
    _searchController.dispose();
    _fullAddressController.dispose();
    _streetController.dispose();
    _buildingController.dispose();
    _floorController.dispose();
    _apartmentController.dispose();
    _landmarkController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    super.dispose();
  }

  Future<void> _searchPlaces(String query) async {
    if (query.length < 3) {
      setState(() => _autocompleteResults = []);
      return;
    }
    try {
      final url = Uri.parse(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=$query&key=$_googleMapsApiKey&components=country:eg',
      );
      final response = await http.get(url);
      final data = json.decode(response.body);
      if (data['status'] == 'OK') {
        setState(() {
          _autocompleteResults = List<Map<String, dynamic>>.from(
            data['predictions'].map((p) => {
              'place_id': p['place_id'],
              'description': p['description'],
            }),
          );
        });
      }
    } catch (_) {}
  }

  Future<void> _getPlaceDetails(String placeId) async {
    try {
      final url = Uri.parse(
        'https://maps.googleapis.com/maps/api/place/details/json?place_id=$placeId&key=$_googleMapsApiKey&fields=geometry,formatted_address,address_components',
      );
      final response = await http.get(url);
      final data = json.decode(response.body);
      if (data['status'] == 'OK') {
        final result = data['result'];
        final location = result['geometry']['location'];
        final address = result['formatted_address'] ?? '';
        final components = result['address_components'] as List? ?? [];

        setState(() {
          _latitude = location['lat'];
          _longitude = location['lng'];
          _fullAddressController.text = address;
          _autocompleteResults = [];
        });

        for (final component in components) {
          final types = component['types'] as List;
          if (types.contains('route')) {
            _streetController.text = component['long_name'];
          }
          if (types.contains('locality')) {
            _cityController.text = component['long_name'];
          }
          if (types.contains('administrative_area_level_1')) {
            _stateController.text = component['long_name'];
          }
        }
      }
    } catch (_) {}
  }

  void _saveAddress() {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final addressData = {
      'label': _selectedLabel,
      'full_address': _fullAddressController.text.trim(),
      'street': _streetController.text.trim().isNotEmpty
          ? _streetController.text.trim()
          : null,
      'building': _buildingController.text.trim().isNotEmpty
          ? _buildingController.text.trim()
          : null,
      'floor': _floorController.text.trim().isNotEmpty
          ? _floorController.text.trim()
          : null,
      'apartment': _apartmentController.text.trim().isNotEmpty
          ? _apartmentController.text.trim()
          : null,
      'landmark': _landmarkController.text.trim().isNotEmpty
          ? _landmarkController.text.trim()
          : null,
      'city': _cityController.text.trim().isNotEmpty
          ? _cityController.text.trim()
          : null,
      'state': _stateController.text.trim().isNotEmpty
          ? _stateController.text.trim()
          : null,
      'country': 'EG',
      if (_latitude != null) 'latitude': _latitude,
      if (_longitude != null) 'longitude': _longitude,
    };

    context.read<AddressBloc>().add(AddAddress(addressData: addressData));
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AddressBloc, AddressState>(
      listener: (context, state) {
        if (state is AddressOperationSuccess) {
          setState(() => _isLoading = false);
          Navigator.pop(context);
        } else if (state is AddressError) {
          setState(() => _isLoading = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: NovaTheme.errorColor,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: NovaTheme.backgroundColor,
        appBar: AppBar(
          title: const Text('Add Address'),
        ),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(NovaTheme.spacingMd),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildLabelSection(),
                  const SizedBox(height: NovaTheme.spacingMd),
                  _buildSearchLocationField(),
                  const SizedBox(height: NovaTheme.spacingMd),
                  _buildFullAddressField(),
                  const SizedBox(height: NovaTheme.spacingMd),
                  _buildStreetField(),
                  const SizedBox(height: NovaTheme.spacingMd),
                  _buildRowFields(),
                  const SizedBox(height: NovaTheme.spacingMd),
                  _buildLandmarkField(),
                  const SizedBox(height: NovaTheme.spacingMd),
                  _buildCityStateFields(),
                  const SizedBox(height: NovaTheme.spacingXl),
                  _buildSaveButton(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabelSection() {
    return Container(
      padding: const EdgeInsets.all(NovaTheme.spacingMd),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Label',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: NovaTheme.textPrimary,
            ),
          ),
          const SizedBox(height: NovaTheme.spacingSm),
          Row(
            children: _labelOptions.map((label) {
              final isSelected = _selectedLabel == label;
              return Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedLabel = label),
                  child: Container(
                    margin: EdgeInsets.only(
                      right: label != _labelOptions.last ? 8 : 0,
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? NovaTheme.primaryColor
                          : NovaTheme.backgroundColor,
                      borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
                      border: Border.all(
                        color: isSelected
                            ? NovaTheme.primaryColor
                            : NovaTheme.borderColor,
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _getLabelIcon(label),
                          size: 18,
                          color: isSelected
                              ? NovaTheme.textOnPrimary
                              : NovaTheme.textSecondary,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          label,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: isSelected
                                ? NovaTheme.textOnPrimary
                                : NovaTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  IconData _getLabelIcon(String label) {
    switch (label) {
      case 'Home':
        return Icons.home_outlined;
      case 'Work':
        return Icons.work_outline;
      default:
        return Icons.location_on_outlined;
    }
  }

  Widget _buildSearchLocationField() {
    return Container(
      padding: const EdgeInsets.all(NovaTheme.spacingMd),
      decoration: BoxDecoration(
        color: NovaTheme.surfaceColor,
        borderRadius: BorderRadius.circular(NovaTheme.radiusMd),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Search Location',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: NovaTheme.textPrimary,
            ),
          ),
          const SizedBox(height: NovaTheme.spacingSm),
          TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Search for your address...',
              prefixIcon: const Icon(Icons.search, size: 20),
              suffixIcon: _latitude != null
                  ? const Icon(Icons.check_circle, color: NovaTheme.successColor, size: 20)
                  : null,
              isDense: true,
            ),
            onChanged: _searchPlaces,
          ),
          if (_autocompleteResults.isNotEmpty) ...[
            const SizedBox(height: 8),
            Container(
              constraints: const BoxConstraints(maxHeight: 200),
              decoration: BoxDecoration(
                color: NovaTheme.surfaceColor,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: NovaTheme.borderColor),
              ),
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: _autocompleteResults.length,
                itemBuilder: (context, index) {
                  final result = _autocompleteResults[index];
                  return ListTile(
                    dense: true,
                    leading: const Icon(Icons.location_on_outlined, size: 18),
                    title: Text(
                      result['description'] ?? '',
                      style: const TextStyle(fontSize: 13),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    onTap: () {
                      _getPlaceDetails(result['place_id']);
                      _searchController.text = result['description'] ?? '';
                    },
                  );
                },
              ),
            ),
          ],
          if (_latitude != null && _longitude != null) ...[
            const SizedBox(height: NovaTheme.spacingSm),
            Text(
              'Location selected: ${_latitude!.toStringAsFixed(4)}, ${_longitude!.toStringAsFixed(4)}',
              style: const TextStyle(
                fontSize: 12,
                color: NovaTheme.successColor,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildFullAddressField() {
    return TextFormField(
      controller: _fullAddressController,
      maxLines: 2,
      decoration: const InputDecoration(
        labelText: 'Full Address *',
        prefixIcon: Icon(Icons.location_on_outlined),
        alignLabelWithHint: true,
      ),
      validator: (value) {
        if (value == null || value.trim().isEmpty) {
          return 'Please enter the full address';
        }
        if (value.trim().length < 10) {
          return 'Please enter a more detailed address';
        }
        return null;
      },
    );
  }

  Widget _buildStreetField() {
    return TextFormField(
      controller: _streetController,
      decoration: const InputDecoration(
        labelText: 'Street',
        prefixIcon: Icon(Icons.route_outlined),
      ),
      validator: (value) {
        if (value == null || value.trim().isEmpty) {
          return 'Please enter the street name';
        }
        return null;
      },
    );
  }

  Widget _buildRowFields() {
    return Row(
      children: [
        Expanded(
          child: TextFormField(
            controller: _buildingController,
            decoration: const InputDecoration(
              labelText: 'Building *',
              prefixIcon: Icon(Icons.apartment),
            ),
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return 'Required';
              }
              return null;
            },
          ),
        ),
        const SizedBox(width: NovaTheme.spacingSm),
        Expanded(
          child: TextFormField(
            controller: _floorController,
            decoration: const InputDecoration(
              labelText: 'Floor',
            ),
          ),
        ),
        const SizedBox(width: NovaTheme.spacingSm),
        Expanded(
          child: TextFormField(
            controller: _apartmentController,
            decoration: const InputDecoration(
              labelText: 'Apt',
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLandmarkField() {
    return TextFormField(
      controller: _landmarkController,
      decoration: const InputDecoration(
        labelText: 'Landmark',
        prefixIcon: Icon(Icons.flag_outlined),
        hintText: 'e.g., near mall, opposite school',
      ),
    );
  }

  Widget _buildCityStateFields() {
    return Row(
      children: [
        Expanded(
          child: TextFormField(
            controller: _cityController,
            decoration: const InputDecoration(
              labelText: 'City *',
              prefixIcon: Icon(Icons.location_city_outlined),
            ),
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return 'Required';
              }
              return null;
            },
          ),
        ),
        const SizedBox(width: NovaTheme.spacingSm),
        Expanded(
          child: TextFormField(
            controller: _stateController,
            decoration: const InputDecoration(
              labelText: 'State *',
              prefixIcon: Icon(Icons.map_outlined),
            ),
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return 'Required';
              }
              return null;
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSaveButton() {
    return ElevatedButton(
      onPressed: _isLoading ? null : _saveAddress,
      style: ElevatedButton.styleFrom(
        backgroundColor: NovaTheme.primaryColor,
        foregroundColor: NovaTheme.textOnPrimary,
        disabledBackgroundColor: NovaTheme.borderColor,
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(NovaTheme.radiusSm),
        ),
      ),
      child: _isLoading
          ? const SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: NovaTheme.textOnPrimary,
              ),
            )
          : const Text(
              'Save Address',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
    );
  }
}
