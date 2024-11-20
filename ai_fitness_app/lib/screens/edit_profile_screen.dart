import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../components/custom_text_field.dart';

class EditProfileScreen extends StatefulWidget {
  final Map<String, dynamic> userData;

  const EditProfileScreen({super.key, required this.userData});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late TextEditingController _nameController;
  late TextEditingController _ageController;
  late TextEditingController _heightController;
  late TextEditingController _weightController;
  late TextEditingController _fitnessGoalController;
  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.userData['name']);
    _ageController =
        TextEditingController(text: widget.userData['age']?.toString());
    _heightController =
        TextEditingController(text: widget.userData['height']?.toString());
    _weightController =
        TextEditingController(text: widget.userData['weight']?.toString());
    _fitnessGoalController =
        TextEditingController(text: widget.userData['fitnessGoal']);
  }

  Future<void> _updateProfile() async {
    try {
      final userId = widget.userData['_id'] ?? widget.userData['id'];
      if (userId == null) throw Exception("User ID not found");

      await _apiService.updateUserProfile(
        userId,
        {
          "name": _nameController.text,
          "age": int.tryParse(_ageController.text),
          "height": int.tryParse(_heightController.text),
          "weight": int.tryParse(_weightController.text),
          "fitnessGoal": _fitnessGoalController.text,
        },
      );
      if (!mounted) return;
      Navigator.pop(context);
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update profile: $error')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Edit Profile"),
        backgroundColor: Theme.of(context).primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            CustomTextField(controller: _nameController, label: "Name"),
            CustomTextField(
              controller: _ageController,
              label: "Age",
              keyboardType: TextInputType.number,
            ),
            CustomTextField(
              controller: _heightController,
              label: "Height (cm)",
              keyboardType: TextInputType.number,
            ),
            CustomTextField(
              controller: _weightController,
              label: "Weight (kg)",
              keyboardType: TextInputType.number,
            ),
            CustomTextField(
              controller: _fitnessGoalController,
              label: "Fitness Goal",
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _updateProfile,
              child: const Text("Save"),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text("Back to Profile"),
            ),
          ],
        ),
      ),
    );
  }
}
