import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light');

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light');
  });

  describe('初始状态', () => {
    it('应该默认为暗色主题', () => {
      expect(service.theme()).toBe('dark');
      expect(service.isDark()).toBe(true);
    });
  });

  describe('setTheme', () => {
    it('应该正确设置亮色主题', () => {
      service.setTheme('light');
      TestBed.flushEffects();

      expect(service.theme()).toBe('light');
      expect(service.isDark()).toBe(false);
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('应该正确设置暗色主题', () => {
      service.setTheme('light');
      TestBed.flushEffects();
      service.setTheme('dark');
      TestBed.flushEffects();

      expect(service.theme()).toBe('dark');
      expect(service.isDark()).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('应该将主题保存到 localStorage', () => {
      service.setTheme('light');
      TestBed.flushEffects();

      expect(localStorage.getItem('halolight-theme')).toBe('light');
    });
  });

  describe('toggle', () => {
    it('应该在暗色和亮色之间切换', () => {
      expect(service.isDark()).toBe(true);

      service.toggle();
      TestBed.flushEffects();
      expect(service.isDark()).toBe(false);

      service.toggle();
      TestBed.flushEffects();
      expect(service.isDark()).toBe(true);
    });
  });

  describe('从 localStorage 恢复', () => {
    it('应该恢复保存的主题', () => {
      localStorage.setItem('halolight-theme', 'light');

      // 重新创建服务
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      const newService = TestBed.inject(ThemeService);

      expect(newService.theme()).toBe('light');
    });
  });
});
