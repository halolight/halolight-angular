import { TestBed } from '@angular/core/testing';
import { AuthService, PERMISSIONS, ROLES } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    // 清除 localStorage
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('初始状态', () => {
    it('应该初始化为未认证状态', () => {
      expect(service.isAuthenticated()).toBe(false);
      expect(service.user()).toBeNull();
      expect(service.token).toBeNull();
    });
  });

  describe('setAuth', () => {
    it('应该正确设置认证信息', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: '测试用户',
        role: 'admin' as const,
        permissions: ['*'],
      };

      service.setAuth('test-token', mockUser);

      expect(service.isAuthenticated()).toBe(true);
      expect(service.user()).toEqual(mockUser);
      expect(service.token).toBe('test-token');
    });

    it('应该将认证信息保存到 localStorage', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: '测试用户',
      };

      service.setAuth('test-token', mockUser);
      TestBed.flushEffects();

      expect(localStorage.getItem('auth_token')).toBe('test-token');
      expect(JSON.parse(localStorage.getItem('auth_user') || '{}')).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('应该清除认证信息', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: '测试用户',
      };

      service.setAuth('test-token', mockUser);
      service.logout();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.user()).toBeNull();
      expect(service.token).toBeNull();
    });
  });

  describe('权限检查', () => {
    it('hasPermission 应该正确检查单个权限', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: '测试用户',
        role: 'user' as const,
        permissions: ['dashboard:view', 'users:list'],
      };

      service.setAuth('test-token', mockUser);

      expect(service.hasPermission('dashboard:view')).toBe(true);
      expect(service.hasPermission('users:list')).toBe(true);
      expect(service.hasPermission('users:delete')).toBe(false);
    });

    it('hasPermission 应该正确处理通配符权限 *', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: '管理员',
        role: 'admin' as const,
        permissions: ['*'],
      };

      service.setAuth('test-token', mockUser);

      expect(service.hasPermission('dashboard:view')).toBe(true);
      expect(service.hasPermission('users:delete')).toBe(true);
      expect(service.hasPermission('any:permission')).toBe(true);
    });

    it('hasPermission 应该正确处理模块通配符', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: '经理',
        role: 'manager' as const,
        permissions: ['dashboard:*', 'users:list'],
      };

      service.setAuth('test-token', mockUser);

      expect(service.hasPermission('dashboard:view')).toBe(true);
      expect(service.hasPermission('dashboard:edit')).toBe(true);
      expect(service.hasPermission('users:list')).toBe(true);
      expect(service.hasPermission('users:delete')).toBe(false);
    });

    it('hasAnyPermission 应该在拥有任一权限时返回 true', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: '测试用户',
        permissions: ['dashboard:view'],
      };

      service.setAuth('test-token', mockUser);

      expect(service.hasAnyPermission(['dashboard:view', 'users:delete'])).toBe(true);
      expect(service.hasAnyPermission(['users:create', 'users:delete'])).toBe(false);
    });

    it('hasAllPermissions 应该在拥有所有权限时返回 true', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: '测试用户',
        permissions: ['dashboard:view', 'users:list', 'users:view'],
      };

      service.setAuth('test-token', mockUser);

      expect(service.hasAllPermissions(['dashboard:view', 'users:list'])).toBe(true);
      expect(service.hasAllPermissions(['dashboard:view', 'users:delete'])).toBe(false);
    });
  });

  describe('PERMISSIONS 常量', () => {
    it('应该包含所有预定义权限', () => {
      expect(PERMISSIONS['dashboard:view']).toBe('查看仪表盘');
      expect(PERMISSIONS['users:delete']).toBe('删除用户');
      expect(PERMISSIONS['settings:update']).toBe('更新设置');
    });
  });

  describe('ROLES 常量', () => {
    it('应该包含管理员角色', () => {
      expect(ROLES.admin.name).toBe('管理员');
      expect(ROLES.admin.permissions).toContain('*');
    });

    it('应该包含经理角色', () => {
      expect(ROLES.manager.name).toBe('经理');
      expect(ROLES.manager.permissions).toContain('dashboard:*');
    });

    it('应该包含普通用户角色', () => {
      expect(ROLES.user.name).toBe('普通用户');
      expect(ROLES.user.permissions).toContain('dashboard:view');
    });
  });
});
