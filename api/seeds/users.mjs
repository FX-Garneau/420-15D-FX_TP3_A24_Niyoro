// TODO/seed: Add at least 5 users, including one admin

export default [
   {
      _id: "650dade494237ad07eedc7ee",
      first_name: "Jean-Michel",
      last_name: "Malgaré",
      username: "admin",
      courriel: "admin@niyoro",
      password: "$2a$10$zVI7XPKsc7D8pAD6RQ4f6O7o5c2TQBy/3tLq7M0./AtKHrFYgcZpa",
      avatar: "https://robohash.org/admin",
      is_active: true,
      is_admin: true,
   },
   {
      _id: "650dadf594237ad07eedc7f0",
      first_name: "Claire",
      last_name: "Voyante",
      username: "clairevoyante",
      courriel: "user1@niyoro.ca",
      password: "$2a$10$zVI7XPKsc7D8pAD6RQ4f6O7o5c2TQBy/3tLq7M0./AtKHrFYgcZpa",
      avatar: "https://robohash.org/clairevoyante",
      is_active: true,
      is_admin: false,
   },
   {
      _id: "650dcaf47bc86e471e5c0af6",
      first_name: "Jean",
      last_name: "Saisrien",
      username: "jeansaisrien",
      courriel: "user2@niyoro.ca",
      password: "$2a$10$zVI7XPKsc7D8pAD6RQ4f6O7o5c2TQBy/3tLq7M0./AtKHrFYgcZpa",
      avatar: "https://robohash.org/jeansaisrien",
      is_active: true,
      is_admin: false,
   }
];
