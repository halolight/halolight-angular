import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/ui';
import { LucideAngularModule, Plus, Upload, Download, Settings } from 'lucide-angular';

@Component({
  selector: 'app-quick-actions-widget',
  standalone: true,
  imports: [ButtonComponent, LucideAngularModule],
  template: `
    <div class="grid grid-cols-2 gap-2">
      <ui-button variant="outline" class="justify-start gap-2">
        <lucide-angular [img]="PlusIcon" class="h-4 w-4" />
        新建项目
      </ui-button>
      <ui-button variant="outline" class="justify-start gap-2">
        <lucide-angular [img]="UploadIcon" class="h-4 w-4" />
        上传文件
      </ui-button>
      <ui-button variant="outline" class="justify-start gap-2">
        <lucide-angular [img]="DownloadIcon" class="h-4 w-4" />
        导出报表
      </ui-button>
      <ui-button variant="outline" class="justify-start gap-2">
        <lucide-angular [img]="SettingsIcon" class="h-4 w-4" />
        系统设置
      </ui-button>
    </div>
  `,
})
export class QuickActionsWidgetComponent {
  readonly PlusIcon = Plus;
  readonly UploadIcon = Upload;
  readonly DownloadIcon = Download;
  readonly SettingsIcon = Settings;
}
