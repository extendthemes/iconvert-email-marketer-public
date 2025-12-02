<?php

namespace IconvertEmailMarketer\ProvidersAPI\Base;



use Exception;
use IconvertEmailMarketer\ProvidersAPI\Base\Campaigns\CampaignItem;
use IconvertEmailMarketer\ProvidersAPI\Base\Campaigns\CampaignReport;
use IconvertEmailMarketer\ProvidersAPI\Base\Campaigns\CampaignsQuery;
use IconvertEmailMarketer\ProvidersAPI\Base\Lists\CustomFieldItem;
use IconvertEmailMarketer\ProvidersAPI\Base\Lists\ListItem;
use IconvertEmailMarketer\ProvidersAPI\Base\Lists\ListMemberItem;
use IconvertEmailMarketer\ProvidersAPI\Base\Lists\ListMembersQuery;
use IconvertEmailMarketer\ProvidersAPI\Base\Lists\ListsQuery;
use function array_map;
use function get_object_vars;
use function is_object;

/**
 * Class EmailProviderBase
 * @package IConvert\Base
 */
class EmailProviderBase {

	/**
	 * @var Config|null
	 */
	public $config = null;

	/**
	 * @var null
	 */
	protected $client = null;

	/**
	 * EmailProviderBase constructor.
	 * @param Config $config
	 */
	public function __construct( Config $config ) {
		$this->config = $config;
	}

	/**
	 * findListItem Find a list item
	 *
	 * @param  mixed $toFind The item to be found
	 * @param  mixed $items The items collection
	 * @param  mixed $field The field to be matched
	 * @return void
	 */
	public function findListItem( $toFind, $items, $field = 'id' ) {
		$find_field = is_object( $toFind ) ? $toFind->$field : $toFind;
		foreach ( $items as $item ) {
			if ( $item->$field === $find_field ) {
				return $item;
			}
		}
		return null;
	}

	/**
	 * mapResponseToList Maps a response collection to the list
	 *
	 * @param  mixed $response The response object
	 * @param  mixed $key
	 * @param  mixed $cls
	 * @param  mixed $mappings
	 * @return array
	 */
	public static function mapResponseToList( $response, $key, $cls, $mappings = array() ): array {
		$items = $key ? get_object_vars( $response )[ $key ] : $response;
		$list  = array_map(
			function ( $value ) use ( $cls, $mappings ) {
				return new $cls( $value, $mappings );
			},
			$items
		);
		return $list;
	}

	/**
	 * mapItem Map an item
	 *
	 * @param  mixed $object The object
	 * @param  mixed $mappings The key mappings
	 * @return void
	 */
	public static function mapItem( object &$object, $mappings = array() ) {

		foreach ( $object as $property => $value ) {

			$new_property = $mappings[ $property ] ?? '';

			if ( $new_property && ( $property != $new_property ) ) {

				if ( strpos( $new_property, '.' ) !== false ) {

						$p         = explode( '.', $new_property );
						$namespace = $p[0];
						$field     = $p[1];

					if ( ! isset( $object->$namespace ) ) {
						$object->$namespace = array();
					}

						$object->$namespace[ $field ] = $value;
				} else {
					$new_property          = $mappings[ $property ];
					$object->$new_property = $value;
				}
				unset( $object->$property );
			}
		}

		return $object;
	}

	/**
	 * throwNormalizeException
	 *
	 * @param  mixed $e
	 * @return void
	 */
	public function throwNormalizeException( Exception $e ) {
	}

	// list management//

	/**
	 * getFirstList Gets the first mailing list
	 *
	 * @return ListItem
	 */
	public function getFirstList(): ListItem {
		$lists = $this->getLists();
		return $lists[0];
	}

	/**
	 * getFirstListId The the ID of the first list
	 *
	 * @return int The list ID
	 */
	public function getFirstListId() {
		return $this->getFirstList()->id;
	}

	/**
	 * getLists Get a collection of mailing lists
	 *
	 * @param  ListsQuery|null $query Query parameters
	 * @return ListItem[] An array of List items
	 */
	public function getLists( ListsQuery $query = null ): array {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::getLists );
	}

	/**
	 * createList Creates a new mailing list
	 *
	 * @param ListItem $list_item List item properties
	 * @return ListItem The newly created list item
	 */
	public function createList( ListItem $list_item ): ListItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::createList );
	}

	/**
	 * getList Get a single mailing list
	 *
	 * @param $list_id Mailing list ID
	 * @return ListItem
	 */
	public function getList( $list_id ): ListItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::getList );
	}

	/**
	 * updateList Updates an existing mailing list
	 *
	 * @param $list_id Mailing list ID
	 * @param ListItem $list_item List item properties
	 * @return ListItem The updated mailing list
	 */
	public function updateList( $list_id, ListItem $list_item ): ListItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::updateList );
	}

	/**
	 * deleteList Deletes an existing mailing list
	 *
	 * @param $list_id Mailing list ID
	 */
	public function deleteList( $list_id ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::deleteList );
	}

	// members management//

	/**
	 * getListMembers Get the subscribers of an existing mailing list
	 *
	 * @param $list_id Mailing list ID
	 * @param ListMembersQuery|null $query Query parameters
	 * @return array An array of subscribers
	 */
	public function getListMembers( $list_id, ListMembersQuery $query = null ): array {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::getListMembers );
	}

	/**
	 * addListMember Adds a new subscriber to an existing mailing list
	 *
	 * @param $list_id Mailing list ID
	 * @param ListMemberItem $member Subscriber properties
	 * @return ListMemberItem Newly added Subscriber
	 */
	public function addListMember( $list_id, ListMemberItem $member ): ListMemberItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::addListMember );
	}

	/**
	 * updateListMember Updates an existing subscriber from a mailing list
	 *
	 * @param $list_id Mailing list ID
	 * @param ListMemberItem $member Subscriber properties
	 * @return ListMemberItem The updated subscriber
	 */
	public function updateListMember( $list_id, ListMemberItem $member ): ListMemberItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::updateListMember );
	}

	/**
	 * deleteListMember Deletes a subscriber from a mailing list
	 *
	 * @param $list_id Mailing list ID
	 * @param ListMemberItem $member Subscriber properties
	 */
	public function deleteListMember( $list_id, ListMemberItem $member ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::deleteListMember );
	}

	// campaigns api//

	/**
	 * getCampaigns Gets a list of campaigns
	 *
	 * @param CampaignsQuery|null $query Query parameters
	 * @return CampaignItem[] An array of campaign items
	 */
	public function getCampaigns( CampaignsQuery $query = null ): array {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::getCampaigns );
	}


	/**
	 * getCampaign Gets a single campaign
	 * @param $campaign_id The campaign ID
	 * @return CampaignItem|null A single campaign item
	 * @throws FeatureNotSupportedException
	 */
	public function getCampaign( $campaign_id ): ?CampaignItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::getCampaign );
	}

	/**
	 * createCampaign Creates a new campaign
	 * @param CampaignItem $campaign Campaign properties
	 * @return CampaignItem The newly created campaign item
	 */
	public function createCampaign( CampaignItem $campaign ): CampaignItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::createCampaign );
	}

	/**
	 * updateCampaign Updates a single campaign
	 *
	 * @param $campaign_id Campaign ID
	 * @param CampaignItem $campaign Campaign properties
	 * @return CampaignItem The updated campaign item
	 */
	public function updateCampaign( $campaign_id, CampaignItem $campaign ): CampaignItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::updateCampaign );
	}

	/**
	 * sendCampaign Sends an existing campaign
	 *
	 * @param $campaign_id Campaign ID
	 * @return void
	 */
	public function sendCampaign( $campaign_id ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::sendCampaign );
	}

	/**
	 * getCampaignReports Gets an existing campaign reports
	 *
	 * @param mixed $campaign_id Campaign ID
	 * @param mixed $list_id
	 * @return CampaignReport The campaign report
	 */
	public function getCampaignReports( $campaign_id ): CampaignReport {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::getCampaignReports );
	}

	/**
	 * deleteCampaign Deletes an existing campaign
	 *
	 * @param $campaign_id Campaign ID
	 * @return void
	 */
	public function deleteCampaign( $campaign_id ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::deleteCampaign );
	}

	/**
	 * hasCapability Check if an API has a specific capability
	 *
	 * @param $campaign_id Campaign ID
	 * @return boolean
	 */
	public function hasCapability( $capability ) {
		return static::CAPABILITIES[ $capability ] ?? false;
	}

	/**
	 * getCustomFields Get a list of the existing custom fields
	 *
	 * @param $list_id Mailing list ID
	 * @return array An array with all the existing custom fields
	 */
	public function getCustomFields( $list_id ): array {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::getCustomFields );
	}

	/**
	 * getCustomField Get a single custom field
	 *
	 * @param mixed $list_id Mailing list ID
	 * @param mixed $custom_field_id Custom field ID
	 * @return CustomFieldItem Single custom field item
	 */
	public function getCustomField( $list_id, $custom_field_id ): CustomFieldItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::getCustomField );
	}

	/**
	 * addCustomField Adds a single custom field to a mailing list
	 *
	 * @param mixed $list_id Mailing list ID
	 * @param CustomFieldItem Custom field properties
	 * @return CustomFieldItem Newly created custom field item
	 */
	public function addCustomField( $list_id, CustomFieldItem $custom_field ): CustomFieldItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::addCustomField );
	}

	/**
	 * updateCustomField Updates a single custom field
	 *
	 * @param mixed $list_id Mailing list ID
	 * @param CustomFieldItem Custom field properties
	 * @return CustomFieldItem Updated custom field item
	 */
	public function updateCustomField( $list_id, CustomFieldItem $custom_field ): CustomFieldItem {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::updateCustomField );
	}

	/**
	 * deleteCustomField Deletes an existing custom field
	 *
	 * @param mixed $list_id Mailing list ID
	 * @param $custom_field_id Custom field ID
	 */
	public function deleteCustomField( $list_id, $custom_field_id ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::deleteCustomField );
	}

	public function sendTransactionalEmailFromPHPMailer($phpmailer ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		throw new FeatureNotSupportedException( Features::sendTransactionalFromPHPMailer );
	}
}
