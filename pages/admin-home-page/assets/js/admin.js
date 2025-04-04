// API URL
const API_URL = 'https://demo-api-skills.vercel.app/api/LanguageLearner';

class AdminPanel {
    constructor() {
        // Cache DOM elements
        this.userTable = document.getElementById('userTable');
        this.searchInput = document.getElementById('searchEmail');
        this.addUserForm = document.getElementById('addUserForm');
        this.addUserModal = document.getElementById('addUserModal');
        this.addUserBtn = document.getElementById('addUserBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.editUserModal = document.getElementById('editUserModal');
        this.editUserForm = document.getElementById('editUserForm');
        this.closeEditModalBtn = document.getElementById('closeEditModalBtn');
        
        // Bind event handlers
        this.initializeEventListeners();
        
        // Load initial data
        this.loadUsers();
    }
    
    initializeEventListeners() {
        // Table events
        this.userTable.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                this.handleDeleteUser(e);
            } else if (e.target.classList.contains('edit-btn')) {
                this.handleEditClick(e);
            }
        });
        
        // Search events
        this.searchInput.addEventListener('input', () => this.handleSearch());
        
        // Modal events
        this.addUserBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.closeEditModalBtn.addEventListener('click', () => this.closeEditModal());
        
        // Form events
        this.addUserForm.addEventListener('submit', (e) => this.handleAddUser(e));
        this.editUserForm.addEventListener('submit', (e) => this.handleEditUser(e));
    }
    
    async loadUsers(retryCount = 3) {
        if (!this.userTable) return;
        
        this.showLoadingState();
        
        try {
            // Add a small delay before the first request
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const response = await fetch(`${API_URL}/users`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const users = await response.json();
            this.renderUsers(users);
        } catch (error) {
            console.error('Error:', error);
            if (retryCount > 0) {
                // Wait a bit longer before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.loadUsers(retryCount - 1);
            }
            this.showErrorState();
        }
    }
    
    renderUsers(users) {
        if (!Array.isArray(users) || users.length === 0) {
            this.userTable.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No users found</td></tr>';
            return;
        }
        
        this.userTable.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200 hover:bg-gray-100';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2';
            deleteBtn.textContent = 'Delete';
            deleteBtn.dataset.userId = user.id;

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600';
            editBtn.textContent = 'Edit';
            editBtn.dataset.userId = user.id;
            editBtn.dataset.userEmail = user.email;
            editBtn.dataset.userName = user.name;
            
            row.innerHTML = `
                <td class="p-4">${user.id || ''}</td>
                <td class="p-4">${user.email || ''}</td>
                <td class="p-4">${user.name || ''}</td>
                <td class="p-4"></td>
            `;
            const actionsCell = row.querySelector('td:last-child');
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            this.userTable.appendChild(row);
        });
    }
    
    showLoadingState() {
        this.userTable.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Loading users...</td></tr>';
    }
    
    showErrorState() {
        this.userTable.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Error loading users. Please try again later.</td></tr>';
    }
    
    async handleDeleteUser(event) {
        const userId = event.target.dataset.userId;
        if (!userId || !confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            await this.loadUsers();
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    handleEditClick(event) {
        const btn = event.target;
        const email = btn.dataset.userEmail;
        document.getElementById('editUserId').value = btn.dataset.userId;
        const emailInput = document.getElementById('editEmail');
        emailInput.value = email;
        emailInput.dataset.originalEmail = email; // Store original email for comparison
        document.getElementById('editName').value = btn.dataset.userName;
        this.openEditModal();
    }
    
    async handleEditUser(event) {
        event.preventDefault();
        
        const userId = document.getElementById('editUserId').value;
        const emailInput = document.getElementById('editEmail');
        const newEmail = emailInput.value.trim();
        const newName = document.getElementById('editName').value.trim();
        const oldEmail = emailInput.dataset.originalEmail;
        
        if (!newName || !newEmail) {
            console.error('Please fill in all fields');
            return;
        }
        
        try {
            // Update name first
            const nameResponse = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName })
            });
            
            if (!nameResponse.ok) {
                throw new Error(`HTTP error updating name! status: ${nameResponse.status}`);
            }

            // Update email if it changed
            if (oldEmail !== newEmail) {
                const emailResponse = await fetch(`${API_URL}/users/login/${oldEmail}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: newEmail })
                });
                
                if (!emailResponse.ok) {
                    throw new Error(`HTTP error updating email! status: ${emailResponse.status}`);
                }
            }
            
            this.closeEditModal();
            await this.loadUsers();
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    async handleAddUser(event) {
        event.preventDefault();
        
        const email = document.getElementById('addEmail').value.trim();
        const name = document.getElementById('addName').value.trim();
        const password = document.getElementById('addPassword').value;
        
        if (!email || !name || !password) {
            console.error('Please fill in all fields');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name, password })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.addUserForm.reset();
            this.closeModal();
            await this.loadUsers();
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    handleSearch() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const rows = this.userTable.querySelectorAll('tr:not(:first-child)');
        
        rows.forEach(row => {
            const email = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            row.style.display = email.includes(searchTerm) ? '' : 'none';
        });
    }
    
    openModal() {
        this.addUserModal.classList.remove('hidden');
    }
    
    closeModal() {
        this.addUserModal.classList.add('hidden');
    }
    
    openEditModal() {
        this.editUserModal.classList.remove('hidden');
    }
    
    closeEditModal() {
        this.editUserModal.classList.add('hidden');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
}); 