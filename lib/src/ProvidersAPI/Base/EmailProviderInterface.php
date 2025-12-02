<?php

namespace IconvertEmailMarketer\ProvidersAPI\Base;

use IconvertEmailMarketer\ProvidersAPI\Base\Campaigns\CampaignItem;
use IconvertEmailMarketer\ProvidersAPI\Base\Campaigns\CampaignsQuery;
use IconvertEmailMarketer\ProvidersAPI\Base\Lists\ListItem;
use IconvertEmailMarketer\ProvidersAPI\Base\Lists\ListMemberItem;
use IconvertEmailMarketer\ProvidersAPI\Base\Lists\ListMembersQuery;

interface EmailProviderInterface {

	public function getFirstList(): ListItem;
	public function getFirstListId(): int;
	public function getLists( $query = null ): array;
	public function createList( ListItem $list_item ): ListItem;
	public function getList( int $list_id ): ListItem;
	public function updateList( int $list_id, ListItem $list_item ): ListItem;
	public function deleteList( int $list_id );
	public function getListMembers( int $list_id, ListMembersQuery $query = null ): array;
	public function addListMember( int $list_id, ListMemberItem $member ): ListMemberItem;
	public function updateListMember( int $list_id, ListMemberItem $member ): ListMemberItem;
	public function deleteListMember( int $list_id, ListMemberItem $member );
	public function getCampaigns( CampaignsQuery $query = null ): array;
	public function getCampaign( int $campaign_id ): ?CampaignItem;
	public function createCampaign( CampaignItem $campaign ): CampaignItem;
	public function updateCampaign( int $campaign_id, CampaignItem $campaign ): CampaignItem;
	public function sendCampaign( int $campaign_id );
	public function deleteCampaign( int $campaign_id );
}
