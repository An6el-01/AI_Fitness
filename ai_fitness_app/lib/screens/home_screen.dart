import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key}); // Add the key parameter

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Home")),
      body: const Center(
        child: Text(
          "Welcome to AI Fitness App!",
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
