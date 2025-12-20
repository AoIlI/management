package org.example.demo.entity;



public class LogInfo {

        private final String username;
        private final String role;

        public LogInfo(String username, String role) {
            this.username = username;
            this.role = role;
        }

        public String getUsername() {
            return username;
        }

        public String getRole() {
            return role;
        }
}
