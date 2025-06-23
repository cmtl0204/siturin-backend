import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  SoftRemoveEvent,
} from 'typeorm';
import { AuditLog } from './audit.entity';
import { getCurrentUser } from './audit-context';
import { isDeepStrictEqual } from 'node:util';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  //Add entities non auditable Ej. User.name
  private readonly nonAuditableEntities = new Set<string>([]);

  listenTo() {
    return Object; // escucha a todas las entidades, o puedes poner User si quieres limitarlo
  }

  private async log<T>(
    event: InsertEvent<T> | UpdateEvent<T> | SoftRemoveEvent<T> | RemoveEvent<T>,
    action: string,
    data: {
      oldData?: Partial<T>;
      newData?: Partial<T>;
      entityId?: any;
    },
  ) {
    if (!event.entity) return;

    // Para que no entre en un bucle con AuditLog mismo
    if (event.metadata.target === AuditLog) return;

    // Para descartar Entities que no se quiere que se auditen
    if (this.nonAuditableEntities.has(event.metadata.name)) return;

    const currentUser = getCurrentUser();
    const userId = currentUser?.id;

    await event.manager.save(AuditLog, {
      action,
      entity: event.metadata.name,
      auditableId: data.entityId,
      oldData: data.oldData || null,
      newData: data.newData || null,
      userId,
    });
  }

  async afterInsert(event: InsertEvent<any>) {
    await this.log(event, 'CREATE', {
      newData: event.entity,
      entityId: event.entityId!,
    });
  }

  async afterUpdate(event: UpdateEvent<any>) {
    const { newChanges, oldChanges } = this.getChangedFields(event.databaseEntity, event.entity);

    if (Object.keys(newChanges).length === 0) {
      // No hay cambios reales, no guardamos auditoría
      return;
    }

    await this.log(event, 'UPDATE', {
      newData: newChanges,
      oldData: oldChanges,
      entityId: event.entity?.id,
    });
  }

  async beforeRemove(event: RemoveEvent<any>) {
    await this.log(event, 'DELETE', {
      oldData: event.databaseEntity,
      entityId: event.entityId,
    });
  }

  async afterSoftRemove(event: RemoveEvent<any>) {
    await this.log(event, 'SOFT_DELETE', {
      oldData: event.databaseEntity,
      entityId: event.entityId,
    });
  }

  private getChangedFields(
    oldData: any,
    newData: any,
  ): {
    newChanges: Record<string, any>;
    oldChanges: Record<string, any>;
  } {
    const newChanges = {};
    const oldChanges = {};

    if (!oldData || !newData) return { newChanges, oldChanges };

    for (const key of Object.keys(newData)) {
      if (!isDeepStrictEqual(oldData[key], newData[key]) && key !== 'updatedAt') {
        newChanges[key] = newData[key];
        oldChanges[key] = oldData[key];
      }
    }

    return { newChanges, oldChanges };
  }
}
