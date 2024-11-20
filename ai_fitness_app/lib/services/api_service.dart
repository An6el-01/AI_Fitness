import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  final String baseUrl = "http://192.168.1.69:5000/api";
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
// Replace with your computer's IP

  Future<Map<String, dynamic>> registerUser(
      String name, String email, String password) async {
    final url = Uri.parse('$baseUrl/users/register');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to register user');
    }
  }

  Future<void> loginUser(String email, String password) async {
    final url = Uri.parse('$baseUrl/users/login');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final responseBody = jsonDecode(response.body);
      final token = responseBody['token'];

      // Decode the JWT to extract the user ID
      final parts = token.split('.');
      if (parts.length != 3) throw Exception('Invalid JWT');
      final payload = json
          .decode(utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))));

      final userId = payload['userId'];
      debugPrint(userId);
      // Store the token and user ID
      await _storage.write(key: 'auth_token', value: token);
      await _storage.write(key: 'user_id', value: userId);
    } else {
      throw Exception('Failed to login user');
    }
  }

  Future<void> updateUserProfile(
      String userId, Map<String, dynamic> updatedData) async {
    debugPrint("Updating User Profile for $userId");
    final token = await _storage.read(key: 'auth_token');
    if (token == null) {
      throw Exception("Auth token not found");
    }

    final url = Uri.parse('$baseUrl/users/$userId');
    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(updatedData),
    );

    if (response.statusCode == 200) {
      debugPrint("User Profile updated successfully");
    } else {
      throw Exception('Failed to update user profile [api_service.dart]');
    }
  }

  Future<Map<String, dynamic>> getUserProfile(String userId) async {
    debugPrint("Getting User Profile");
    final token = await _storage.read(key: 'auth_token');
    if (token == null) {
      throw Exception("Auth token not found");
    }

    final url = Uri.parse('$baseUrl/users/$userId');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      debugPrint("User Profile acquired");
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to get user profile [api_service.dart]');
    }
  }
}
