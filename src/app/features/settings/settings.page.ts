import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
  ButtonComponent,
  InputComponent,
  LabelComponent,
  SwitchComponent,
  SeparatorComponent,
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
  SelectComponent,
  type SelectOption,
  ToastService,
} from '../../shared/components/ui';
import { LucideAngularModule, User, Bell, Shield, Palette, Globe, Save } from 'lucide-angular';

interface ProfileSettings {
  name: string;
  email: string;
  bio: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: string;
}

interface AppearanceSettings {
  theme: string;
  language: string;
  fontSize: string;
}

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    FormsModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
    ButtonComponent,
    InputComponent,
    LabelComponent,
    SwitchComponent,
    SeparatorComponent,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
    SelectComponent,
    LucideAngularModule,
  ],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-foreground">系统设置</h1>
        <p class="text-muted-foreground mt-1">管理您的账户设置和偏好选项</p>
      </div>

      <!-- Settings Tabs -->
      <ui-tabs [defaultValue]="'profile'">
        <ui-tabs-list class="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <ui-tabs-trigger value="profile">
            <lucide-angular [img]="UserIcon" class="h-4 w-4 mr-2" />
            个人资料
          </ui-tabs-trigger>
          <ui-tabs-trigger value="notifications">
            <lucide-angular [img]="BellIcon" class="h-4 w-4 mr-2" />
            通知
          </ui-tabs-trigger>
          <ui-tabs-trigger value="security">
            <lucide-angular [img]="ShieldIcon" class="h-4 w-4 mr-2" />
            安全
          </ui-tabs-trigger>
          <ui-tabs-trigger value="appearance">
            <lucide-angular [img]="PaletteIcon" class="h-4 w-4 mr-2" />
            外观
          </ui-tabs-trigger>
        </ui-tabs-list>

        <!-- Profile Settings -->
        <ui-tabs-content value="profile">
          <ui-card>
            <ui-card-header>
              <ui-card-title>个人资料</ui-card-title>
              <ui-card-description>更新您的个人信息和账户资料</ui-card-description>
            </ui-card-header>
            <ui-card-content class="space-y-4">
              <div class="space-y-2">
                <ui-label for="name">用户名</ui-label>
                <ui-input
                  id="name"
                  [(ngModel)]="profile.name"
                  placeholder="请输入用户名"
                />
              </div>
              <div class="space-y-2">
                <ui-label for="email">邮箱地址</ui-label>
                <ui-input
                  id="email"
                  type="email"
                  [(ngModel)]="profile.email"
                  placeholder="请输入邮箱"
                />
              </div>
              <div class="space-y-2">
                <ui-label for="bio">个人简介</ui-label>
                <ui-input
                  id="bio"
                  [(ngModel)]="profile.bio"
                  placeholder="简单介绍一下自己"
                />
              </div>
            </ui-card-content>
            <ui-card-footer>
              <ui-button (click)="saveProfile()">
                <lucide-angular [img]="SaveIcon" class="h-4 w-4 mr-2" />
                保存更改
              </ui-button>
            </ui-card-footer>
          </ui-card>
        </ui-tabs-content>

        <!-- Notification Settings -->
        <ui-tabs-content value="notifications">
          <ui-card>
            <ui-card-header>
              <ui-card-title>通知设置</ui-card-title>
              <ui-card-description>管理您接收通知的方式</ui-card-description>
            </ui-card-header>
            <ui-card-content class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <ui-label>邮件通知</ui-label>
                  <p class="text-sm text-muted-foreground">接收重要更新的邮件提醒</p>
                </div>
                <ui-switch [(checked)]="notifications.emailNotifications" />
              </div>
              <ui-separator />
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <ui-label>推送通知</ui-label>
                  <p class="text-sm text-muted-foreground">在浏览器中接收实时推送</p>
                </div>
                <ui-switch [(checked)]="notifications.pushNotifications" />
              </div>
              <ui-separator />
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <ui-label>每周摘要</ui-label>
                  <p class="text-sm text-muted-foreground">每周发送活动摘要邮件</p>
                </div>
                <ui-switch [(checked)]="notifications.weeklyDigest" />
              </div>
              <ui-separator />
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <ui-label>营销邮件</ui-label>
                  <p class="text-sm text-muted-foreground">接收产品更新和优惠信息</p>
                </div>
                <ui-switch [(checked)]="notifications.marketingEmails" />
              </div>
            </ui-card-content>
            <ui-card-footer>
              <ui-button (click)="saveNotifications()">
                <lucide-angular [img]="SaveIcon" class="h-4 w-4 mr-2" />
                保存设置
              </ui-button>
            </ui-card-footer>
          </ui-card>
        </ui-tabs-content>

        <!-- Security Settings -->
        <ui-tabs-content value="security">
          <ui-card>
            <ui-card-header>
              <ui-card-title>安全设置</ui-card-title>
              <ui-card-description>保护您的账户安全</ui-card-description>
            </ui-card-header>
            <ui-card-content class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <ui-label>两步验证</ui-label>
                  <p class="text-sm text-muted-foreground">启用两步验证以增强账户安全</p>
                </div>
                <ui-switch [(checked)]="security.twoFactorAuth" />
              </div>
              <ui-separator />
              <div class="space-y-2">
                <ui-label for="sessionTimeout">会话超时</ui-label>
                <ui-select
                  id="sessionTimeout"
                  [options]="sessionTimeoutOptions"
                  [(ngModel)]="security.sessionTimeout"
                  placeholder="选择超时时间"
                />
                <p class="text-sm text-muted-foreground">在此时间后自动退出登录</p>
              </div>
              <ui-separator />
              <div class="space-y-2">
                <ui-label>修改密码</ui-label>
                <p class="text-sm text-muted-foreground mb-2">定期更换密码以保护账户安全</p>
                <ui-button variant="outline">修改密码</ui-button>
              </div>
            </ui-card-content>
            <ui-card-footer>
              <ui-button (click)="saveSecurity()">
                <lucide-angular [img]="SaveIcon" class="h-4 w-4 mr-2" />
                保存设置
              </ui-button>
            </ui-card-footer>
          </ui-card>
        </ui-tabs-content>

        <!-- Appearance Settings -->
        <ui-tabs-content value="appearance">
          <ui-card>
            <ui-card-header>
              <ui-card-title>外观设置</ui-card-title>
              <ui-card-description>自定义界面显示效果</ui-card-description>
            </ui-card-header>
            <ui-card-content class="space-y-6">
              <div class="space-y-2">
                <ui-label for="theme">主题模式</ui-label>
                <ui-select
                  id="theme"
                  [options]="themeOptions"
                  [(ngModel)]="appearance.theme"
                  placeholder="选择主题"
                />
              </div>
              <ui-separator />
              <div class="space-y-2">
                <ui-label for="language">
                  <lucide-angular [img]="GlobeIcon" class="h-4 w-4 mr-2 inline" />
                  界面语言
                </ui-label>
                <ui-select
                  id="language"
                  [options]="languageOptions"
                  [(ngModel)]="appearance.language"
                  placeholder="选择语言"
                />
              </div>
              <ui-separator />
              <div class="space-y-2">
                <ui-label for="fontSize">字体大小</ui-label>
                <ui-select
                  id="fontSize"
                  [options]="fontSizeOptions"
                  [(ngModel)]="appearance.fontSize"
                  placeholder="选择字体大小"
                />
              </div>
            </ui-card-content>
            <ui-card-footer>
              <ui-button (click)="saveAppearance()">
                <lucide-angular [img]="SaveIcon" class="h-4 w-4 mr-2" />
                保存设置
              </ui-button>
            </ui-card-footer>
          </ui-card>
        </ui-tabs-content>
      </ui-tabs>
    </div>
  `,
})
export class SettingsPage {
  private readonly toast = inject(ToastService);

  // Icons
  readonly UserIcon = User;
  readonly BellIcon = Bell;
  readonly ShieldIcon = Shield;
  readonly PaletteIcon = Palette;
  readonly GlobeIcon = Globe;
  readonly SaveIcon = Save;

  // Profile settings
  profile: ProfileSettings = {
    name: '管理员',
    email: 'admin@halolight.h7ml.cn',
    bio: '',
  };

  // Notification settings
  notifications: NotificationSettings = {
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    marketingEmails: false,
  };

  // Security settings
  security: SecuritySettings = {
    twoFactorAuth: false,
    sessionTimeout: '30',
  };

  // Appearance settings
  appearance: AppearanceSettings = {
    theme: 'dark',
    language: 'zh-CN',
    fontSize: 'medium',
  };

  // Select options
  readonly sessionTimeoutOptions: SelectOption[] = [
    { value: '15', label: '15 分钟' },
    { value: '30', label: '30 分钟' },
    { value: '60', label: '1 小时' },
    { value: '120', label: '2 小时' },
    { value: 'never', label: '永不' },
  ];

  readonly themeOptions: SelectOption[] = [
    { value: 'light', label: '浅色模式' },
    { value: 'dark', label: '深色模式' },
    { value: 'system', label: '跟随系统' },
  ];

  readonly languageOptions: SelectOption[] = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁体中文' },
    { value: 'en-US', label: 'English' },
  ];

  readonly fontSizeOptions: SelectOption[] = [
    { value: 'small', label: '小' },
    { value: 'medium', label: '中' },
    { value: 'large', label: '大' },
  ];

  saveProfile(): void {
    this.toast.success('个人资料已保存');
  }

  saveNotifications(): void {
    this.toast.success('通知设置已保存');
  }

  saveSecurity(): void {
    this.toast.success('安全设置已保存');
  }

  saveAppearance(): void {
    this.toast.success('外观设置已保存');
  }
}
