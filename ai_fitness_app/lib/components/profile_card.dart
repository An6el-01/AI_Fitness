import 'package:flutter/material.dart';

class ProfileCard extends StatelessWidget {
  final Map<String, dynamic> userData;

  const ProfileCard({super.key, required this.userData});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Name: ${userData['name']}",
                style: const TextStyle(fontSize: 18)),
            Text("Email: ${userData['email']}",
                style: const TextStyle(fontSize: 18)),
            Text("Age: ${userData['age'] ?? 'N/A'}",
                style: const TextStyle(fontSize: 18)),
            Text("Height: ${userData['height'] ?? 'N/A'} cm",
                style: const TextStyle(fontSize: 18)),
            Text("Weight: ${userData['weight'] ?? 'N/A'} kg",
                style: const TextStyle(fontSize: 18)),
            Text("Fitness Goal: ${userData['fitnessGoal'] ?? 'N/A'}",
                style: const TextStyle(fontSize: 18)),
          ],
        ),
      ),
    );
  }
}
